import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Upload, File, Trash2, Eye, Download,
  CheckCircle, XCircle, Loader2, Search, Plus
} from 'lucide-react';
import { supabase, KnowledgeBaseItem, API_URL } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const KnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }

    setUploading(true);
    try {
      // Get signature from backend
      const sigRes = await fetch(`${API_URL}/api/cloudinary/signature?resource_type=raw&folder=knowledge_base`);
      const sig = await sigRes.json();

      if (!sig.cloud_name || !sig.api_key) {
        toast.error('Cloudinary not configured. Please add credentials.');
        setUploading(false);
        return;
      }

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.api_key);
      formData.append('timestamp', sig.timestamp);
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/raw/upload`,
        { method: 'POST', body: formData }
      );
      const uploadData = await uploadRes.json();

      if (uploadData.error) {
        throw new Error(uploadData.error.message);
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: user?.id,
          title: file.name.replace('.pdf', ''),
          file_url: uploadData.secure_url,
          file_public_id: uploadData.public_id,
          file_size: file.size,
          file_type: 'pdf',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setItems([data, ...items]);
      toast.success('Document uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (item: KnowledgeBaseItem) => {
    const { error } = await supabase
      .from('knowledge_base')
      .update({ is_active: !item.is_active })
      .eq('id', item.id);

    if (!error) {
      setItems(items.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
      toast.success(`Document ${!item.is_active ? 'enabled' : 'disabled'} for AI`);
    }
  };

  const deleteItem = async (item: KnowledgeBaseItem) => {
    if (!confirm('Delete this document?')) return;

    try {
      // Delete from Cloudinary
      await fetch(`${API_URL}/api/cloudinary/${encodeURIComponent(item.file_public_id)}`, {
        method: 'DELETE'
      });

      // Delete from Supabase
      await supabase.from('knowledge_base').delete().eq('id', item.id);
      setItems(items.filter(i => i.id !== item.id));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="knowledge-base-page" className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Upload documents to train your AI receptionist</p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Upload PDF
          </div>
        </label>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A059]/50"
        />
      </div>

      {/* Documents Grid */}
      {filteredItems.length === 0 ? (
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
          <p className="text-gray-500 text-sm">Upload PDF documents to help your AI answer questions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <File className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500">{formatFileSize(item.file_size)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleActive(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.is_active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}
                >
                  {item.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {item.is_active ? 'Active' : 'Inactive'}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
