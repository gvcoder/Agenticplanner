import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Plan } from '../types';
import {
  Calendar,
  Clock,
  Target,
  Download,
  Share2,
  Check,
  ChevronDown,
  FileText,
  FileCode,
  Globe,
  Printer,
  Copy
} from 'lucide-react';
import { downloadPlan } from '../lib/downloadUtils';

interface PlanDetailProps {
  plan: Plan;
}

export function PlanDetail({ plan }: PlanDetailProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = (format: 'md' | 'txt' | 'html') => {
    setIsDropdownOpen(false);
    try {
      const filename = downloadPlan(plan, format);
      setDownloadNotice(`Downloaded ${filename}`);
      setTimeout(() => setDownloadNotice(null), 3500);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download the plan. Please try again.');
    }
  };

  const handlePrint = () => {
    setIsDropdownOpen(false);
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Action Plan: ${plan.requirement}`,
          text: plan.content,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      await navigator.clipboard.writeText(plan.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-[#5A5A40]/10 overflow-hidden min-h-[80vh] flex flex-col print-area">
      {/* Header Banner */}
      <div className="p-10 bg-[#5A5A40] text-white relative overflow-hidden">
        {/* Action Controls */}
        <div className="absolute top-0 right-0 p-6 flex items-center gap-3 no-print z-20">
          {/* Download Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="inline-flex rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all shadow-md">
              <button
                onClick={() => handleDownload('md')}
                className="flex items-center gap-2 pl-4 pr-3 py-2.5 text-sm font-medium tracking-wide hover:text-amber-100 transition-colors"
                title="Download Plan as Markdown (.md)"
              >
                <Download className="w-4 h-4" />
                <span>Download Plan</span>
              </button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-2.5 py-2.5 border-l border-white/20 hover:bg-white/10 rounded-r-full transition-colors"
                title="Choose download format"
                aria-expanded={isDropdownOpen}
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-[#1A1A1A] rounded-2xl shadow-2xl border border-[#5A5A40]/15 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-[#5A5A40]/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]/60">Select Format</p>
                </div>

                <button
                  onClick={() => handleDownload('md')}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F0] flex items-center gap-3 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">Markdown (.md)</div>
                    <div className="text-[11px] text-[#5A5A40]/60">For Obsidian, Notion, GitHub</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownload('txt')}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F0] flex items-center gap-3 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">Plain Text (.txt)</div>
                    <div className="text-[11px] text-[#5A5A40]/60">Universal readable text</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownload('html')}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F0] flex items-center gap-3 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">HTML Document (.html)</div>
                    <div className="text-[11px] text-[#5A5A40]/60">Standalone styled page</div>
                  </div>
                </button>

                <div className="my-1 border-t border-[#5A5A40]/10" />

                <button
                  onClick={handlePrint}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F0] flex items-center gap-3 transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">Print / Save as PDF</div>
                    <div className="text-[11px] text-[#5A5A40]/60">Browser print & PDF dialog</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Share/Copy Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-full text-sm font-medium transition-colors backdrop-blur-md border border-white/20 shadow-md"
            title="Share or copy plan"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="text-xs">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Floating Notification */}
        {downloadNotice && (
          <div className="absolute top-20 right-6 z-30 bg-white text-[#5A5A40] text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-[#5A5A40]/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Plan Header Info */}
        <div className="relative z-10 pt-4 md:pt-0">
          <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            <Target className="w-4 h-4" />
            Goal & Requirement
          </div>
          <h1 className="text-3xl md:text-5xl font-light italic mb-8 leading-tight pr-0 md:pr-48">
            {plan.requirement}
          </h1>

          <div className="flex flex-wrap gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Timeframe</p>
                <p className="text-sm font-medium">{plan.startDate} to {plan.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Commitment</p>
                <p className="text-sm font-medium">{plan.hoursPerWeek} hours per week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Plan Markdown Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-light prose-headings:italic prose-headings:text-[#5A5A40] prose-p:text-[#1A1A1A]/85 prose-li:text-[#1A1A1A]/85 prose-strong:text-[#5A5A40] prose-blockquote:border-l-[#5A5A40] prose-blockquote:bg-[#F5F5F0] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
          <Markdown>{plan.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
