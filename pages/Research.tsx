import React, { useEffect, useState } from 'react';
import { Search, ExternalLink, Tag } from 'lucide-react';
import { googleSheets, Research as ResearchItem } from '../lib/googleSheets';

const Research: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      try {
        const data = await googleSheets.getResearch();
        setResearchItems(data || []);
      } catch (error) {
        console.error("Error fetching research", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const categories = ['All', 'Clients', 'Ideas', 'Documents'];

  const filteredItems = researchItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.type?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Research</h1>
          <p className="text-sm text-gray-500">Insights, ideas, and client documentation</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search research..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === cat 
                ? 'bg-[#050505] text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse" />
      ) : filteredItems.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-3xl shadow-sm">
          No research items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="premium-card p-5 hover:-translate-y-1 transition-transform group">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                  {item.type}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{item.date_added}</span>
              </div>
              
              <h3 className="font-semibold text-lg leading-tight mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.summary}</p>
              
              <div className="mt-auto space-y-4">
                {item.tags && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.split(',').map((tag, tIdx) => (
                      <span key={tIdx} className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        <Tag className="w-3 h-3" />
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Added by <span className="text-black">{item.owner}</span></span>
                  
                  {item.source_link && (
                    <a 
                      href={item.source_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Research;
