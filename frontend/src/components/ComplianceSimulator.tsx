import React from 'react';
import { Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ComplianceSimulatorProps {
  currentHour: number;
  onHourChange: (hour: number) => void;
}

export const ComplianceSimulator: React.FC<ComplianceSimulatorProps> = ({
  currentHour,
  onHourChange,
}) => {
  const isCompliant = currentHour >= 8 && currentHour < 19;

  return (
    <div className="rounded-xl border-2 border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-slate-50 to-white p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#00BAF2]" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
            RBI Contact Hours Check (08:00–19:00 IST)
          </span>
        </div>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isCompliant
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
          }`}
        >
          {isCompliant ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Permitted</span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
              <span>Outreach Blocked</span>
            </>
          )}
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
          <span>08:00 IST (Open)</span>
          <span className="font-bold text-[#002970] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Simulated: {currentHour.toString().padStart(2, '0')}:00 IST
          </span>
          <span>19:00 IST (Cutoff)</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={currentHour}
          onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002970] focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            {isCompliant ? (
              <span className="text-emerald-700 font-medium">
                ✓ Fair Practices Code active: Voice & WhatsApp communication permitted.
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                ⚠️ Outside RBI window: Messages held until 08:05 AM T+1 sweep to prevent harassment.
              </span>
            )}
          </span>
          <button
            onClick={() => onHourChange(14)}
            className="text-[10px] text-[#00BAF2] hover:underline flex-shrink-0 ml-2"
          >
            Reset to 14:00
          </button>
        </div>
      </div>
    </div>
  );
};
