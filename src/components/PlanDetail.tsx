import Markdown from 'react-markdown';
import { Plan } from '../types';
import { Calendar, Clock, Target, Download, Share2 } from 'lucide-react';

interface PlanDetailProps {
  plan: Plan;
}

export function PlanDetail({ plan }: PlanDetailProps) {
  const handleDownload = () => {
    const blob = new Blob([plan.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-${plan.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Action Plan: ${plan.requirement}`,
        text: plan.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(plan.content);
      alert('Plan copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-[#5A5A40]/10 overflow-hidden min-h-[80vh] flex flex-col">
      <div className="p-10 bg-[#5A5A40] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 flex gap-4">
          <button
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            title="Download Markdown"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            title="Share Plan"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
            <Target className="w-4 h-4" />
            Requirement
          </div>
          <h1 className="text-5xl font-light italic mb-8 leading-tight">{plan.requirement}</h1>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Timeframe</p>
                <p className="text-sm font-medium">{plan.startDate} to {plan.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Commitment</p>
                <p className="text-sm font-medium">{plan.hoursPerWeek} hours per week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-light prose-headings:italic prose-headings:text-[#5A5A40] prose-p:text-[#1A1A1A]/80 prose-li:text-[#1A1A1A]/80 prose-strong:text-[#5A5A40] prose-blockquote:border-l-[#5A5A40] prose-blockquote:bg-[#F5F5F0] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
          <Markdown>{plan.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
