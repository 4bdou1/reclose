import React, { useEffect, useState } from 'react';
import { Search, Folder, File, FileText, Image, MoreVertical, ExternalLink } from 'lucide-react';
import { googleSheets, FileData } from '../lib/googleSheets';

const categories = ['All Files', 'Client files', 'Research', 'Documents', 'Assets', 'Pitch decks'];

const Files: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Files');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await googleSheets.getFiles();
        setFiles(data || []);
      } catch (error) {
        console.error("Error fetching files", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

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
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Files</h1>
          <p className="text-sm text-gray-500">Internal company library</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
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
              No files found in this category.
            </div>
          ) : (
            <div className="premium-card overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      {getFileIcon(file.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.file_name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="truncate">{file.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">Added {file.date_added} by {file.uploaded_by}</span>
                      </div>
                    </div>

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
                    
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors hidden md:block">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
