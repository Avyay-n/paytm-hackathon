import React, { useState } from 'react';
import { BarChart3, TrendingDown, Info } from 'lucide-react';
import { UpiSettlement } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';

interface SettlementChartProps {
  settlements: UpiSettlement[];
  peerAverage: number;
}

export const SettlementChart: React.FC<SettlementChartProps> = ({
  settlements,
  peerAverage,
}) => {
  const [hoveredDay, setHoveredDay] = useState<UpiSettlement | null>(null);

  const maxVolume = Math.max(...settlements.map((s) => s.gross_volume), 8000);

  return (
    <SpotlightCard className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#00BAF2]" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-tight">
              30-Day UPI QR Settlement & T+1 Morning Sweep Telemetry
            </h4>
            <p className="text-[11px] text-slate-400">
              Days 1–23 Baseline vs. Days 24–30 Macro Inundation Dip
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#00BAF2]" />
            <span className="text-slate-300">Normal (₹4,200/day)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
            <span className="text-slate-300">Macro Dip (-45%)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="relative mt-4 h-36 w-full pt-4">
        {/* Peer Cluster Average Horizontal Benchmark Line */}
        <div
          style={{ bottom: `${(peerAverage / maxVolume) * 100}%` }}
          className="absolute left-0 right-0 border-b border-dashed border-[#6366F1]/60 z-10 pointer-events-none"
        >
          <span className="absolute -top-4 right-0 rounded bg-indigo-950/80 px-1.5 py-0.5 font-mono text-[9px] text-indigo-300 border border-indigo-500/30">
            Pin Code Peer Benchmark: ₹{peerAverage.toFixed(0)}/day
          </span>
        </div>

        {/* 30 Bars */}
        <div className="flex h-full items-end gap-1">
          {settlements.map((s) => {
            const heightPct = (s.gross_volume / maxVolume) * 100;
            const isDip = s.is_dip_period || s.gross_volume === 0;

            return (
              <div
                key={s.id}
                onMouseEnter={() => setHoveredDay(s)}
                onMouseLeave={() => setHoveredDay(null)}
                className="group relative flex-1 cursor-pointer transition-all hover:scale-y-105"
                style={{ height: '100%' }}
              >
                <div
                  style={{ height: `${Math.max(heightPct, 3)}%` }}
                  className={`w-full rounded-t transition-all duration-300 ${
                    s.gross_volume === 0
                      ? 'bg-red-500/50'
                      : isDip
                      ? 'bg-gradient-to-t from-amber-500/40 to-amber-400 group-hover:brightness-125'
                      : 'bg-gradient-to-t from-[#002970] to-[#00BAF2] group-hover:brightness-125'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Axis Indicators */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
        <span>Day 1 (Baseline)</span>
        <span>Day 15</span>
        <span className="text-amber-400 font-bold">Day 24 (Monsoon Hit)</span>
        <span>Day 30 (Today)</span>
      </div>

      {/* Hover Telemetry Readout */}
      <div className="mt-2 min-h-[32px] rounded-lg bg-slate-950/70 p-2 text-xs border border-slate-800 flex items-center justify-between">
        {hoveredDay ? (
          <>
            <span className="font-mono text-white">
              <strong>Day {hoveredDay.day_index}</strong> ({hoveredDay.settlement_date}):{' '}
              <strong className="text-[#00BAF2]">₹{hoveredDay.gross_volume.toLocaleString('en-IN')}</strong> ({hoveredDay.tx_count} txs)
            </span>
            <span className="text-[11px] text-amber-300 italic">{hoveredDay.anomaly_note}</span>
          </>
        ) : (
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-[#00BAF2]" />
            Hover over any day bar to inspect transaction telemetry and anomaly root cause.
          </span>
        )}
      </div>
    </SpotlightCard>
  );
};
