'use client';

import React, { useState } from 'react';
import { 
  ContentBlock, 
  RichTextBlockContent, 
  CalloutBlockContent, 
  VideoBlockContent, 
  ImageBlockContent, 
  AccordionBlockContent, 
  QuizBlockContent 
} from '@/types/lms';
import { 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  Play, 
  HelpCircle,
  Award
} from 'lucide-react';

interface BlockRendererProps {
  block: ContentBlock;
  isEditable?: boolean;
  onAnswerSubmit?: (blockId: string, selectedOption: string, isCorrect: boolean) => void;
}

export function BlockRenderer({ block, isEditable = false, onAnswerSubmit }: BlockRendererProps) {
  switch (block.type) {
    case 'rich_text':
      return <RichTextBlock block={block} isEditable={isEditable} />;
    case 'callout':
      return <CalloutBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'accordion':
      return <AccordionBlock block={block} />;
    case 'quiz':
      return <QuizBlock block={block} isEditable={isEditable} onAnswerSubmit={onAnswerSubmit} />;
    default:
      return (
        <div className="p-4 border border-dashed border-slate-700 rounded-lg text-xs text-slate-400">
          Unsupported block type: {block.type}
        </div>
      );
  }
}

// 1. Rich Text / Heading Block
function RichTextBlock({ block }: { block: ContentBlock; isEditable?: boolean }) {
  const content = block.content_json as RichTextBlockContent;

  return (
    <div className="prose prose-invert max-w-none text-slate-200">
      {content.heading && (
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 flex items-center gap-2">
          {content.heading}
        </h2>
      )}
      <div 
        className="text-sm sm:text-base leading-relaxed text-slate-300 space-y-3"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
}

// 2. Callout / Key Takeaway Block
function CalloutBlock({ block }: { block: ContentBlock }) {
  const content = block.content_json as CalloutBlockContent;

  const variantConfig = {
    takeaway: {
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-950/20',
      badgeBg: 'bg-indigo-500/20 text-indigo-300',
      icon: Award,
      defaultTitle: 'Key Takeaway'
    },
    tip: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
      badgeBg: 'bg-emerald-500/20 text-emerald-300',
      icon: Lightbulb,
      defaultTitle: 'Pro Tip'
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      icon: AlertTriangle,
      defaultTitle: 'Critical Notice'
    },
    info: {
      border: 'border-sky-500/40',
      bg: 'bg-sky-950/20',
      badgeBg: 'bg-sky-500/20 text-sky-300',
      icon: Info,
      defaultTitle: 'Information'
    }
  };

  const style = variantConfig[content.variant || 'takeaway'] || variantConfig.takeaway;
  const Icon = style.icon;

  return (
    <div className={`my-4 rounded-xl border ${style.border} ${style.bg} p-4 sm:p-5 backdrop-blur-sm transition-all`}>
      <div className="flex items-start gap-3.5">
        <div className={`rounded-lg p-2 ${style.badgeBg} shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold tracking-wide text-white">
            {content.title || style.defaultTitle}
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {content.text}
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. Video Embed Block
function VideoBlock({ block }: { block: ContentBlock }) {
  const content = block.content_json as VideoBlockContent;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(content.url);
  const isDirectVideo = content.url.endsWith('.mp4') || content.url.endsWith('.webm');

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
      {content.title && (
        <div className="border-b border-slate-800 px-4 py-2.5 bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <Play className="h-3.5 w-3.5 text-indigo-400" />
            {content.title}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">16:9 HD Media</span>
        </div>
      )}
      
      <div className="relative aspect-video w-full bg-black/90">
        {isDirectVideo ? (
          <video 
            src={content.url} 
            controls 
            className="h-full w-full object-cover"
          />
        ) : (
          <iframe
            src={embedUrl}
            title={content.title || 'Video Player'}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {content.caption && (
        <div className="px-4 py-2 text-xs text-slate-400 bg-slate-950/40 border-t border-slate-800/60">
          {content.caption}
        </div>
      )}
    </div>
  );
}

// 4. Image Block with Caption
function ImageBlock({ block }: { block: ContentBlock }) {
  const content = block.content_json as ImageBlockContent;

  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-md">
      <div className="relative w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'}
          alt={content.alt || 'Course illustration'}
          className="w-full object-cover max-h-[460px] hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
      {content.caption && (
        <figcaption className="border-t border-slate-800/80 px-4 py-2.5 text-center text-xs text-slate-400 italic bg-slate-950/30">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}

// 5. Expandable Accordion Block
function AccordionBlock({ block }: { block: ContentBlock }) {
  const content = block.content_json as AccordionBlockContent;
  const items = content.items || [];
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [items[0]?.id || 'item-0']: true
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="my-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-sm">
      {items.map((item) => {
        const isOpen = !!openItems[item.id];
        return (
          <div key={item.id} className="transition-colors">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-indigo-400' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-400 bg-slate-950/20 border-t border-slate-850">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 6. Knowledge Check Block
function QuizBlock({ 
  block, 
  isEditable = false, 
  onAnswerSubmit 
}: { 
  block: ContentBlock; 
  isEditable?: boolean;
  onAnswerSubmit?: (blockId: string, selectedOption: string, isCorrect: boolean) => void;
}) {
  const content = block.content_json as QuizBlockContent;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (selectedOptionIndex === null) return;
    setIsSubmitted(true);
    const isCorrect = selectedOptionIndex === content.correctOptionIndex;
    if (onAnswerSubmit) {
      onAnswerSubmit(block.id, content.options[selectedOptionIndex], isCorrect);
    }
  };

  const handleReset = () => {
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
  };

  const isCorrect = isSubmitted && selectedOptionIndex === content.correctOptionIndex;

  return (
    <div className="my-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-500/20 p-1.5 text-indigo-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Knowledge Check
            </span>
            <span className="ml-2 text-[11px] text-slate-400">
              Instant Assessment
            </span>
          </div>
        </div>
        {isSubmitted && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Correct
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" /> Incorrect
              </>
            )}
          </span>
        )}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-white leading-snug mb-4">
        {content.question}
      </h3>

      <div className="space-y-2.5 mb-5">
        {content.options?.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isThisOptionCorrect = idx === content.correctOptionIndex;

          let optionStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40';

          if (isSubmitted) {
            if (isThisOptionCorrect) {
              optionStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-medium';
            } else if (isSelected && !isThisOptionCorrect) {
              optionStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-200 line-through opacity-80';
            } else {
              optionStyle = 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'border-indigo-500 bg-indigo-950/40 text-white font-medium shadow-sm';
          }

          return (
            <label
              key={idx}
              onClick={() => {
                if (!isSubmitted) setSelectedOptionIndex(idx);
              }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${optionStyle}`}
            >
              <div className="pt-0.5 shrink-0">
                <input
                  type="radio"
                  name={`quiz-${block.id}`}
                  checked={isSelected}
                  onChange={() => {
                    if (!isSubmitted) setSelectedOptionIndex(idx);
                  }}
                  disabled={isSubmitted}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900"
                />
              </div>
              <span className="flex-1 leading-relaxed">{option}</span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOptionIndex === null}
            className={`w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-md ${
              selectedOptionIndex === null
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        )}

        {isEditable && (
          <span className="text-[11px] text-slate-500 italic">
            Author Preview: Correct answer index: #{content.correctOptionIndex + 1}
          </span>
        )}
      </div>

      {isSubmitted && content.explanation && (
        <div className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-300 ${
          isCorrect 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' 
            : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
        }`}>
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Explanation & Takeaway:
          </div>
          <p>{content.explanation}</p>
        </div>
      )}
    </div>
  );
}
