'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Bell, 
  Plus, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  User as UserIcon,
  Tag
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
      // Refresh local threads state
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
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Announcement':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'System':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
              <Bell className="w-3 h-3" />
              Communication Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Messages & Announcements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Broadcast mandatory deadlines, compliance notices, and curriculum updates.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm hover:shadow active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Broadcast Announcement
        </button>
      </div>

      {/* Split-Pane Container */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-16rem)] min-h-[550px]">
        {/* Left Pane: Threads List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search & Filter */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              {(['All', 'Announcement', 'Compliance', 'System'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
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
                        ? 'bg-white dark:bg-slate-800 border-l-2 border-indigo-600 shadow-sm'
                        : 'hover:bg-white/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(thread.category)}`}>
                        {thread.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{thread.date}</span>
                    </div>

                    <h4 className={`text-xs font-semibold leading-snug line-clamp-1 ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {thread.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {thread.preview}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <img
                        src={thread.senderAvatar}
                        alt={thread.senderName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="truncate">{thread.senderName}</span>
                      {thread.replies.length > 0 && (
                        <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
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
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
          {selectedThread ? (
            <>
              {/* Message Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getCategoryBadgeClass(selectedThread.category)}`}>
                    {selectedThread.category}
                  </span>
                  <span className="text-xs text-slate-400">{selectedThread.date}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedThread.title}
                </h2>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={selectedThread.senderAvatar}
                    alt={selectedThread.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {selectedThread.senderName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedThread.senderRole} • Official Communication
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Body & Replies */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Main message text */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                  {selectedThread.content}
                </div>

                {/* Replies Thread */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Discussion ({selectedThread.replies.length})
                  </h4>

                  {selectedThread.replies.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No responses posted yet. Be the first to reply.</p>
                  ) : (
                    selectedThread.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.avatar}
                              alt={reply.sender}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {reply.sender}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{reply.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                          {reply.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reply Input Box */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write an enterprise reply or inquiry..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-xs">Select an announcement on the left to read details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Broadcast Organization Announcement
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Publish a global notification across all enterprise teams in M.A.S LMS.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual SOC 2 Compliance Verification Deadline"
                  value={newThread.title}
                  onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Tag
                </label>
                <select
                  value={newThread.category}
                  onChange={e => setNewThread({ ...newThread, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Announcement">General Announcement</option>
                  <option value="Compliance">Compliance & Audit</option>
                  <option value="System">System & Maintenance</option>
                  <option value="Curriculum">Curriculum Release</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Announcement Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft message body, instructions, and target action requirements..."
                  value={newThread.content}
                  onChange={e => setNewThread({ ...newThread, content: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
