'use client';

import React, { useState } from 'react';
import { 
  ContentBlock, 
  BlockContentJson,
  AccordionItem,
  RichTextBlockContent,
  CalloutBlockContent,
  VideoBlockContent,
  ImageBlockContent,
  AccordionBlockContent,
  QuizBlockContent
} from '@/types/lms';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Type, 
  Award, 
  Video, 
  Image as ImageIcon, 
  ListCollapse, 
  HelpCircle 
} from 'lucide-react';

interface BlockEditorModalProps {
  block: ContentBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blockId: string, updatedContentJson: BlockContentJson) => void;
}

export function BlockEditorModal({ block, isOpen, onClose, onSave }: BlockEditorModalProps) {
  if (!isOpen || !block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
              {block.type === 'rich_text' && <Type className="h-4 w-4" />}
              {block.type === 'callout' && <Award className="h-4 w-4" />}
              {block.type === 'video' && <Video className="h-4 w-4" />}
              {block.type === 'image' && <ImageIcon className="h-4 w-4" />}
              {block.type === 'accordion' && <ListCollapse className="h-4 w-4" />}
              {block.type === 'quiz' && <HelpCircle className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white capitalize">
                Edit {block.type.replace('_', ' ')} Block
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure content attributes and responsive presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <BlockFormFields block={block} onSave={onSave} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function BlockFormFields({
  block,
  onSave,
  onClose
}: {
  block: ContentBlock;
  onSave: (blockId: string, contentJson: BlockContentJson) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState<BlockContentJson>(JSON.parse(JSON.stringify(block.content_json)));

  const handleSave = () => {
    onSave(block.id, content);
    onClose();
  };

  if (block.type === 'rich_text') {
    const c = content as RichTextBlockContent;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Heading (Optional)</label>
          <input
            type="text"
            value={c.heading || ''}
            onChange={(e) => setContent({ ...c, heading: e.target.value })}
            placeholder="e.g. Overview & Learning Objectives"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">HTML / Markdown Content</label>
          <textarea
            rows={8}
            value={c.html || ''}
            onChange={(e) => setContent({ ...c, html: e.target.value })}
            placeholder="<p>Enter paragraph text...</p>"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  if (block.type === 'callout') {
    const c = content as CalloutBlockContent;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Card Style Variant</label>
            <select
              value={c.variant || 'takeaway'}
              onChange={(e) => setContent({ ...c, variant: e.target.value as CalloutBlockContent['variant'] })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="takeaway">Key Takeaway (Indigo / Trophy)</option>
              <option value="tip">Pro Tip (Emerald / Lightbulb)</option>
              <option value="warning">Warning / Critical (Amber / Alert)</option>
              <option value="info">Information (Sky / Info)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Card Title</label>
            <input
              type="text"
              value={c.title || ''}
              onChange={(e) => setContent({ ...c, title: e.target.value })}
              placeholder="e.g. Golden Rule"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Message Text</label>
          <textarea
            rows={4}
            value={c.text || ''}
            onChange={(e) => setContent({ ...c, text: e.target.value })}
            placeholder="Type key takeaway message..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  if (block.type === 'video') {
    const c = content as VideoBlockContent;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Video Title</label>
          <input
            type="text"
            value={c.title || ''}
            onChange={(e) => setContent({ ...c, title: e.target.value })}
            placeholder="e.g. Zero-Trust Architectural Deep Dive"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Video URL (YouTube or MP4)</label>
          <input
            type="url"
            value={c.url || ''}
            onChange={(e) => setContent({ ...c, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Caption / Subtitle</label>
          <input
            type="text"
            value={c.caption || ''}
            onChange={(e) => setContent({ ...c, caption: e.target.value })}
            placeholder="e.g. 5-minute executive briefing"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  if (block.type === 'image') {
    const c = content as ImageBlockContent;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Image URL</label>
          <input
            type="url"
            value={c.url || ''}
            onChange={(e) => setContent({ ...c, url: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Alt Description (A11y)</label>
          <input
            type="text"
            value={c.alt || ''}
            onChange={(e) => setContent({ ...c, alt: e.target.value })}
            placeholder="Descriptive label for screen readers"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Figure Caption</label>
          <input
            type="text"
            value={c.caption || ''}
            onChange={(e) => setContent({ ...c, caption: e.target.value })}
            placeholder="e.g. Architectural topology of zero-trust network"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  if (block.type === 'accordion') {
    const c = content as AccordionBlockContent;
    const items = c.items || [];

    const handleItemChange = (idx: number, field: 'title' | 'content', val: string) => {
      const updated = [...items];
      updated[idx] = { ...updated[idx], [field]: val };
      setContent({ ...c, items: updated });
    };

    const handleAddItem = () => {
      setContent({
        ...c,
        items: [
          ...items,
          {
            id: 'item-' + Date.now(),
            title: `Section ${items.length + 1}`,
            content: 'Detailed explanation for this topic item...'
          }
        ]
      });
    };

    const handleDeleteItem = (idx: number) => {
      setContent({
        ...c,
        items: items.filter((_, i) => i !== idx)
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-slate-300 font-medium">Accordion Panels</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <Plus className="h-3 w-3" /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item: AccordionItem, idx: number) => (
            <div key={item.id || idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                  placeholder="Panel Title"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={item.content}
                onChange={(e) => handleItemChange(idx, 'content', e.target.value)}
                placeholder="Panel body content..."
                className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-xs text-slate-300"
              />
            </div>
          ))}
        </div>
        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  if (block.type === 'quiz') {
    const c = content as QuizBlockContent;
    const options = c.options || [];

    const handleOptionChange = (idx: number, val: string) => {
      const updated = [...options];
      updated[idx] = val;
      setContent({ ...c, options: updated });
    };

    const handleAddOption = () => {
      setContent({
        ...c,
        options: [...options, `New Option ${options.length + 1}`]
      });
    };

    const handleDeleteOption = (idx: number) => {
      if (options.length <= 2) return;
      const updated = options.filter((_, i) => i !== idx);
      const newCorrect = c.correctOptionIndex >= updated.length ? 0 : c.correctOptionIndex;
      setContent({ ...c, options: updated, correctOptionIndex: newCorrect });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Quiz Question</label>
          <textarea
            rows={3}
            value={c.question || ''}
            onChange={(e) => setContent({ ...c, question: e.target.value })}
            placeholder="Type your scenario-based multiple choice question..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-medium">
              Answer Choices (Select radio button for Correct Answer)
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="h-3 w-3" /> Add Choice
            </button>
          </div>

          <div className="space-y-2.5">
            {options.map((opt: string, idx: number) => {
              const isCorrect = c.correctOptionIndex === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 rounded-lg border p-2 transition-colors ${
                    isCorrect ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswerChoice"
                    checked={isCorrect}
                    onChange={() => setContent({ ...c, correctOptionIndex: idx })}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
                    placeholder={`Choice #${idx + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Feedback & Rationale (Displayed upon submission)
          </label>
          <textarea
            rows={2}
            value={c.explanation || ''}
            onChange={(e) => setContent({ ...c, explanation: e.target.value })}
            placeholder="Explain why the correct answer is mandated by policy..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <FooterActions onSave={handleSave} onClose={onClose} />
      </div>
    );
  }

  return null;
}

function FooterActions({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
      >
        <Save className="h-3.5 w-3.5" />
        Save Changes
      </button>
    </div>
  );
}
