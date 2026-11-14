import React, { useState } from 'react';
import { BarChart3, Info } from 'lucide-react';
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
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002970]">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
              30-Day UPI QR Settlement Sweeps
            </h4>
            <p className="text-[11px] text-slate-500">
              Days 1–23 Baseline vs. Days 24–30 Macro Dip
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#002970]" />
            <span className="text-slate-600 text-[11px]">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#00BAF2]" />
            <span className="text-slate-600 text-[11px]">Dip (-45%)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization in Paytm Navy & Cyan */}
      <div className="relative mt-3 h-32 w-full pt-4">
        {/* Peer Cluster Benchmark Line */}
        <div
          style={{ bottom: `${(peerAverage / maxVolume) * 100}%` }}
          className="absolute left-0 right-0 border-b border-dashed border-[#002970]/40 z-10 pointer-events-none"
        >
          <span className="absolute -top-3.5 right-0 rounded bg-blue-50 px-1.5 py-0.2 font-mono text-[9px] text-[#002970] border border-blue-200">
            Peer Avg: ₹{peerAverage.toFixed(0)}/day
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
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                  className={`w-full rounded-t transition-all duration-200 ${
                    s.gross_volume === 0
                      ? 'bg-rose-400'
                      : isDip
                      ? 'bg-[#00BAF2] group-hover:bg-[#009FD0]'
                      : 'bg-[#002970] group-hover:bg-[#003B95]'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Axis */}
      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 px-1">
        <span>Day 1</span>
        <span>Day 15</span>
        <span className="text-[#002970] font-bold">Day 24 (Monsoon)</span>
        <span>Day 30 (Today)</span>
      </div>

      {/* Hover Telemetry Readout */}
      <div className="mt-2 min-h-[30px] rounded-lg bg-slate-50 p-2 text-xs border border-slate-200 flex items-center justify-between">
        {hoveredDay ? (
          <>
            <span className="font-mono text-slate-800">
              <strong>Day {hoveredDay.day_index}</strong> ({hoveredDay.settlement_date}):{' '}
              <strong className="text-[#002970]">₹{hoveredDay.gross_volume.toLocaleString('en-IN')}</strong> ({hoveredDay.tx_count} txs)
            </span>
            <span className="text-[11px] text-[#002970] italic">{hoveredDay.anomaly_note}</span>
          </>
        ) : (
          <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-slate-400" />
            Hover over any daily bar to inspect transaction volume and weather anomaly.
          </span>
        )}
      </div>
    </SpotlightCard>
  );
};
