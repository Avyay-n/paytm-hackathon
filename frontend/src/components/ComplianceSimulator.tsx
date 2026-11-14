import React from 'react';
import { Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

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
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#00BAF2]" />
          <span className="text-xs font-bold tracking-tight text-white uppercase">
            RBI Recovery Conduct Time-Window Simulator
          </span>
        </div>

        {/* Live Status Pill */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isCompliant
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
          }`}
        >
          {isCompliant ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>08:00–19:00 IST PERMITTED</span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>OUTREACH BLOCKED PER RBI CODE</span>
            </>
          )}
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>00:00 (Night)</span>
          <span className="font-bold text-[#00BAF2]">08:00 (RBI Open)</span>
          <span className="text-white font-bold bg-[#002970] px-2 py-0.5 rounded border border-[#00BAF2]/40">
            Simulated: {currentHour.toString().padStart(2, '0')}:00 IST
          </span>
          <span className="font-bold text-[#F59E0B]">19:00 (RBI Cutoff)</span>
          <span>23:59 (Night)</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          step="1"
          value={currentHour}
          onChange={(e) => onHourChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#00BAF2] focus:outline-none"
        />

        {/* Informational Guidance */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <p>
            {isCompliant ? (
              <span className="text-emerald-400">
                ✓ Full autonomous voice, Soundbox & WhatsApp restructuring enabled.
              </span>
            ) : (
              <span className="text-red-400">
                ⚠️ Outreach paused to protect borrower from harassment. Queued for 08:05 AM T+1 morning run.
              </span>
            )}
          </p>
          <button
            onClick={() => onHourChange(14)}
            className="text-[10px] text-[#00BAF2] hover:underline"
          >
            Reset to 14:00 IST
          </button>
        </div>
      </div>
    </div>
  );
};
