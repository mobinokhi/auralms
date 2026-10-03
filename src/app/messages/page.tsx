'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Bell, 
  Plus, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { MessageThread } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [replyText, setReplyText] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Thread Form State
  const [newThread, setNewThread] = useState({
    title: '',
    category: 'Announcement' as MessageThread['category'],
    content: ''
  });

  useEffect(() => {
    const list = MasDataStore.getMessages();
    setThreads(list);
    if (list.length > 0) {
      setSelectedThreadId(list[0].id);
    }
  }, []);

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = categoryFilter === 'All' || thread.category === categoryFilter;
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const reply = MasDataStore.addReply(
      selectedThread.id,
      replyText.trim(),
      'Current User (You)',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
    );

    if (reply) {
      setThreads(MasDataStore.getMessages());
      setReplyText('');
      showToast('Reply published to discussion thread.');
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim()) return;

    const created = MasDataStore.addMessage(
      newThread.title.trim(),
      newThread.content.trim(),
      newThread.category,
      'Compliance Officer',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
    );

    setThreads(prev => [created, ...prev]);
    setSelectedThreadId(created.id);
    setIsNewModalOpen(false);
    setNewThread({
      title: '',
      category: 'Announcement',
      content: ''
    });
    showToast('New enterprise announcement published.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getCategoryBadgeClass = (category: MessageThread['category']) => {
    switch (category) {
      case 'Compliance':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Announcement':
        return 'bg-purple-50 text-[#7C3AED] border-purple-200';
      case 'System':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-[#64748B] border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
              <Bell className="w-3.5 h-3.5" />
              Communication Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            Messages & Announcements
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Broadcast mandatory deadlines, compliance notices, and curriculum updates.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Broadcast Announcement
        </button>
      </div>

      {/* Split-Pane Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-16rem)] min-h-[550px]">
        {/* Left Pane: Threads List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-[#F8FAFC]">
          {/* Search & Filter */}
          <div className="p-3.5 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {(['All', 'Announcement', 'Compliance', 'System'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
                    categoryFilter === cat
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                No announcement threads match.
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = thread.id === selectedThread?.id;

                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left p-3.5 transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-l-2 border-[#7C3AED] shadow-xs'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(thread.category)}`}>
                        {thread.category}
                      </span>
                      <span className="text-[11px] text-[#64748B]">{thread.date}</span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? 'text-[#7C3AED]' : 'text-[#1E293B]'
                    }`}>
                      {thread.title}
                    </h4>

                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {thread.preview}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B]">
                      <img
                        src={thread.senderAvatar}
                        alt={thread.senderName}
                        className="w-4 h-4 rounded-full object-cover border border-slate-200"
                      />
                      <span className="truncate">{thread.senderName}</span>
                      {thread.replies.length > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                          {thread.replies.length} replies
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Selected Thread Content & Discussion */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {selectedThread ? (
            <>
              {/* Message Header */}
              <div className="p-5 border-b border-slate-200">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getCategoryBadgeClass(selectedThread.category)}`}>
                    {selectedThread.category}
                  </span>
                  <span className="text-xs text-[#64748B]">{selectedThread.date}</span>
                </div>

                <h2 className="text-lg font-bold text-[#1E293B]">
                  {selectedThread.title}
                </h2>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                  <img
                    src={selectedThread.senderAvatar}
                    alt={selectedThread.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">
                      {selectedThread.senderName}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      {selectedThread.senderRole} • Official Communication
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Body & Replies */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="text-xs sm:text-sm text-[#1E293B] leading-relaxed space-y-3 whitespace-pre-line font-normal">
                  {selectedThread.content}
                </div>

                {/* Replies Thread */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Discussion ({selectedThread.replies.length})
                  </h4>

                  {selectedThread.replies.length === 0 ? (
                    <p className="text-xs text-[#64748B] italic">No responses posted yet. Be the first to reply.</p>
                  ) : (
                    selectedThread.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.avatar}
                              alt={reply.sender}
                              className="w-5 h-5 rounded-full object-cover border border-slate-200"
                            />
                            <span className="font-bold text-[#1E293B]">
                              {reply.sender}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#64748B]">{reply.date}</span>
                        </div>
                        <p className="text-xs text-[#1E293B] pl-7 leading-relaxed">
                          {reply.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reply Input Box */}
              <div className="p-4 border-t border-slate-200 bg-[#F8FAFC]">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write an enterprise reply or inquiry..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#64748B]">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs">Select an announcement on the left to read details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Broadcast Organization Announcement
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Publish a global notification across all enterprise teams in M.A.S LMS.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual SOC 2 Compliance Verification Deadline"
                  value={newThread.title}
                  onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Category Tag
                </label>
                <select
                  value={newThread.category}
                  onChange={e => setNewThread({ ...newThread, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                >
                  <option value="Announcement">General Announcement</option>
                  <option value="Compliance">Compliance & Audit</option>
                  <option value="System">System & Maintenance</option>
                  <option value="Curriculum">Curriculum Release</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Full Announcement Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft message body, instructions, and target action requirements..."
                  value={newThread.content}
                  onChange={e => setNewThread({ ...newThread, content: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E293B] text-white text-xs font-medium shadow-xl border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
