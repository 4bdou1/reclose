import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, AlertTriangle, Check, Send, User, Clock,
  Phone, Globe, Instagram, ChevronRight
} from 'lucide-react';
import { supabase, InboxMessage, Lead, Conversation } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Inbox: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<(InboxMessage & { lead?: Lead })[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage & { lead?: Lead } | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'flagged'>('all');

  useEffect(() => {
    if (user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from('inbox_messages')
        .select(`
          *,
          lead:leads(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('inbox')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inbox_messages', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const selectMessage = async (msg: InboxMessage & { lead?: Lead }) => {
    setSelectedMessage(msg);
    
    // Mark as read
    if (!msg.is_read) {
      await supabase
        .from('inbox_messages')
        .update({ is_read: true })
        .eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }

    // Fetch conversation
    if (msg.conversation_id) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', msg.conversation_id)
        .single();
      setConversation(data);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedMessage || !conversation) return;

    try {
      // Add message to conversation
      const updatedMessages = [
        ...(conversation.messages || []),
        { role: 'user', content: replyText, timestamp: new Date().toISOString() }
      ];

      await supabase
        .from('conversations')
        .update({ messages: updatedMessages })
        .eq('id', conversation.id);

      setConversation({ ...conversation, messages: updatedMessages });
      setReplyText('');
      toast.success('Reply sent');
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    if (filter === 'flagged') return msg.requires_attention;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;
  const flaggedCount = messages.filter(m => m.requires_attention).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="inbox-page" className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Inbox</h1>
          <p className="text-gray-500 mt-1">Messages requiring manual intervention</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-xs font-medium">
            {flaggedCount} flagged
          </span>
          <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
            {unreadCount} unread
          </span>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Message List */}
        <div className="w-96 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-white/5 flex gap-2">
            {(['all', 'unread', 'flagged'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No messages</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-white/[0.04]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.requires_attention ? 'bg-[#FF6B2B]/10' : 'bg-[#C5A059]/10'
                    }`}>
                      {msg.requires_attention ? (
                        <AlertTriangle className="w-5 h-5 text-[#FF6B2B]" />
                      ) : (
                        <User className="w-5 h-5 text-[#C5A059]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${!msg.is_read ? 'text-white' : 'text-gray-400'}`}>
                          {msg.lead?.name || 'Unknown'}
                        </span>
                        {!msg.is_read && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{msg.content}</p>
                      {msg.flagged_reason && (
                        <p className="text-[10px] text-[#FF6B2B] mt-1">{msg.flagged_reason}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                    <span className="text-[#C5A059] font-bold">
                      {selectedMessage.lead?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{selectedMessage.lead?.name}</h3>
                    <p className="text-xs text-gray-500">{selectedMessage.lead?.email}</p>
                  </div>
                </div>
                {selectedMessage.requires_attention && (
                  <span className="px-3 py-1 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-xs">
                    Needs Attention
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {conversation?.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'lead' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        msg.role === 'lead'
                          ? 'bg-white/5 text-white rounded-bl-md'
                          : msg.role === 'ai'
                          ? 'bg-[#C5A059]/20 text-[#C5A059] rounded-br-md'
                          : 'bg-blue-500/20 text-blue-400 rounded-br-md'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] opacity-50 mt-1">
                        {msg.role === 'ai' ? 'AI' : msg.role === 'user' ? 'You' : 'Lead'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="p-4 border-t border-white/5">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A059]/50"
                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  />
                  <button
                    onClick={sendReply}
                    className="px-4 py-3 bg-[#C5A059] text-black rounded-xl hover:bg-[#C5A059]/90 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
