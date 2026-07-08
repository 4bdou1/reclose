import React, { useState, useEffect } from 'react';
import { Search, Folder, File as FileIcon, FileText, Image, MoreVertical, ExternalLink, Plus, X, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const categories = ['All Files', 'Client files', 'Research', 'Documents', 'Assets', 'Pitch decks'];

interface FileData {
  id: string;
  file_name: string;
  category: string;
  file_url: string;
  file_type: string;
  uploaded_by_id: string;
  uploaded_by_name: string;
  visibility: string;
  created_at: string;
}

const Files: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('All Files');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'pdf' | 'link'>('pdf');
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState('Documents');
  const [newFileVisibility, setNewFileVisibility] = useState<'for all' | 'for me'>('for all');
  const [newFileLink, setNewFileLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();

    const subscription = supabase
      .channel('files_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, fetchFiles)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!newFileName.trim()) return toast.error('Please enter a file name');
    if (uploadType === 'link' && !newFileLink.trim()) return toast.error('Please enter a link');
    if (uploadType === 'pdf' && !selectedFile) return toast.error('Please select a PDF file');

    setIsUploading(true);
    try {
      let fileUrl = newFileLink;

      if (uploadType === 'pdf' && selectedFile) {
        // Upload to Storage
        const fileExt = selectedFile.name.split('.').pop();
        const safeFileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user?.id}/${safeFileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('dashboard-files')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('dashboard-files')
          .getPublicUrl(filePath);
          
        fileUrl = publicUrl;
      }

      // Insert into Database
      const uploaderName = user?.user_metadata?.full_name || user?.email || 'Unknown';
      const { error: dbError } = await supabase.from('files').insert({
        file_name: newFileName,
        category: newFileCategory,
        file_url: fileUrl,
        file_type: uploadType,
        uploaded_by_id: user?.id,
        uploaded_by_name: uploaderName,
        visibility: newFileVisibility
      });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully!');
      setIsModalOpen(false);
      resetModal();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, fileType: string, fileUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      if (fileType === 'pdf') {
        // Extract file path from URL (dashboard-files/path)
        const urlObj = new URL(fileUrl);
        const pathParts = urlObj.pathname.split('/dashboard-files/');
        if (pathParts.length > 1) {
          const filePath = decodeURIComponent(pathParts[1]);
          await supabase.storage.from('dashboard-files').remove([filePath]);
        }
      }

      const { error } = await supabase.from('files').delete().eq('id', id);
      if (error) throw error;
      toast.success('File deleted');
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Failed to delete file');
    }
  };

  const resetModal = () => {
    setUploadType('pdf');
    setNewFileName('');
    setNewFileCategory('Documents');
    setNewFileVisibility('for all');
    setNewFileLink('');
    setSelectedFile(null);
  };

  const filteredFiles = files.filter(f => {
    const matchesCat = activeCategory === 'All Files' || f.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = f.file_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getFileIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'assets': return <Image className="w-5 h-5 text-purple-500" />;
      case 'documents':
      case 'pitch decks': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <FileIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Files</h1>
          <p className="text-sm text-gray-500">Internal company library</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#050505] text-white text-sm font-semibold rounded-xl hover:bg-[#1a1a1a] transition-all shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Sidebar / Folders */}
        <div className="w-full md:w-48 shrink-0 flex overflow-x-auto md:flex-col gap-1 md:overflow-visible hide-scrollbar pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Folder className={`w-4 h-4 ${activeCategory === cat ? 'text-white/80' : 'text-gray-400'}`} />
              {cat}
            </button>
          ))}
        </div>

        {/* File List */}
        <div className="flex-1">
          {loading ? (
            <div className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse" />
          ) : filteredFiles.length === 0 ? (
            <div className="w-full py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-3xl shadow-sm">
              No files found. Try uploading one!
            </div>
          ) : (
            <div className="premium-card overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      {getFileIcon(file.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.file_name}</p>
                        {file.visibility === 'for me' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider border border-gray-200">Private</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="truncate">{file.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">Added by {file.uploaded_by_name}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">{file.file_type.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.file_url && (
                        <a 
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                          title="Open file"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      
                      {file.uploaded_by_id === user?.id && (
                        <button 
                          onClick={() => handleDelete(file.id, file.file_type, file.file_url)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Upload File</h2>
              <button onClick={() => {setIsModalOpen(false); resetModal();}} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Type Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setUploadType('pdf')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${uploadType === 'pdf' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                >
                  PDF File
                </button>
                <button
                  onClick={() => setUploadType('link')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${uploadType === 'link' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                >
                  Web Link
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">File Name</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="e.g. Q3 Pitch Deck"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newFileCategory}
                    onChange={e => setNewFileCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                  >
                    {categories.filter(c => c !== 'All Files').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Visibility</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewFileVisibility('for all')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                        newFileVisibility === 'for all' 
                          ? 'bg-[#D6B36B]/10 border-[#D6B36B] text-[#C5A059]' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      For All
                    </button>
                    <button
                      onClick={() => setNewFileVisibility('for me')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                        newFileVisibility === 'for me' 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      For Me
                    </button>
                  </div>
                </div>

                {uploadType === 'link' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">URL</label>
                    <input
                      type="url"
                      value={newFileLink}
                      onChange={e => setNewFileLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">PDF File</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                      >
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-medium">
                          {selectedFile ? selectedFile.name : 'Click to select a PDF'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleUpload}
                disabled={isUploading || !newFileName.trim() || (uploadType === 'link' ? !newFileLink.trim() : !selectedFile)}
                className="w-full py-3 bg-[#050505] disabled:bg-gray-300 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:bg-[#1a1a1a]"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
