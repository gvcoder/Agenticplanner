import { useState } from 'react';
import { Plan } from '../types';
import { Trash2, Calendar, Clock, ChevronRight, Download, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import { downloadPlan } from '../lib/downloadUtils';

interface PlanListProps {
  plans: Plan[];
  selectedId?: string;
  onSelect: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export function PlanList({ plans, selectedId, onSelect, onDelete }: PlanListProps) {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 text-[#5A5A40]/40 italic border-2 border-dashed border-[#5A5A40]/10 rounded-3xl">
        No plans generated yet.
      </div>
    );
  }

  const handleQuickDownload = (e: React.MouseEvent, plan: Plan) => {
    e.stopPropagation();
    try {
      downloadPlan(plan, 'md');
      setDownloadedId(plan.id);
      setTimeout(() => setDownloadedId(null), 2500);
    } catch (err) {
      console.error('Quick download error:', err);
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => onSelect(plan)}
          className={cn(
            "group relative p-6 rounded-3xl cursor-pointer transition-all border-2",
            selectedId === plan.id
              ? "bg-white border-[#5A5A40] shadow-xl scale-[1.02]"
              : "bg-white/50 border-transparent hover:border-[#5A5A40]/20 hover:bg-white"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-light italic line-clamp-2 pr-4">{plan.requirement}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleQuickDownload(e, plan)}
                className="p-2 text-[#5A5A40]/50 hover:text-[#5A5A40] hover:bg-[#5A5A40]/10 rounded-full transition-colors"
                title="Download plan (.md)"
              >
                {downloadedId === plan.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(plan.id);
                }}
                className="p-2 text-[#5A5A40]/50 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {plan.startDate} - {plan.endDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {plan.hoursPerWeek}h/week
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-[#5A5A40]/40">
              Generated {formatDistanceToNow(plan.createdAt)} ago
            </span>
            <ChevronRight className={cn(
              "w-5 h-5 transition-transform",
              selectedId === plan.id ? "translate-x-0 text-[#5A5A40]" : "translate-x-2 text-[#5A5A40]/20"
            )} />
          </div>
        </div>
      ))}
    </div>
  );
}
