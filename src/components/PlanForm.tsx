import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';

interface PlanFormProps {
  onSubmit: (input: { requirement: string; startDate: string; endDate: string; hoursPerWeek: number }) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export function PlanForm({ onSubmit, onCancel, isGenerating }: PlanFormProps) {
  const [requirement, setRequirement] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ requirement, startDate, endDate, hoursPerWeek });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#5A5A40]/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <button onClick={onCancel} className="p-2 text-[#5A5A40]/40 hover:text-[#5A5A40] transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-light mb-2 italic">New Plan</h2>
        <p className="text-[#5A5A40]/60">Define your goal and let the agents do the work.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50">Requirement</label>
          <textarea
            required
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder='e.g., "I want to learn Python programming" or "I want to travel Madurai to experience Indian culture"'
            className="w-full p-4 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] min-h-[120px] resize-none text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50">Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50">Hours per Week: <span className="text-[#5A5A40]">{hoursPerWeek}h</span></label>
          <input
            type="range"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
            className="w-full accent-[#5A5A40]"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Agents are planning...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
