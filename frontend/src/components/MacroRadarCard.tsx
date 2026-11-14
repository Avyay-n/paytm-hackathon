import React from 'react';
import { AlertTriangle, ShieldCheck, MapPin, Radio, Activity } from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';
import { PeerClusterRadar } from '../types';

interface MacroRadarCardProps {
  radarData: PeerClusterRadar | null;
  merchantName: string;
}

export const MacroRadarCard: React.FC<MacroRadarCardProps> = ({
  radarData,
  merchantName,
}) => {
  if (!radarData) {
    return (
      <SpotlightCard className="p-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Activity className="h-4 w-4 animate-spin text-[#002970]" />
          <span className="text-xs">Loading regional telemetry...</span>
        </div>
      </SpotlightCard>
    );
  }

  const { macro, peer_cluster_summary } = radarData;
  const isVerifiedShock = macro.verified_external_shock;
  const isFraudDivergence = peer_cluster_summary.affected_pct < 10 && macro.weather_severity_index < 0.2;

  return (
    <SpotlightCard className="p-4">
      {/* Header with Pin Code and Macro Signal */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002970]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#002970]">
                Pin Code {macro.pin_code}
              </span>
              <span className="text-xs text-slate-500">({macro.city})</span>
            </div>
            <p className="text-xs text-slate-800 font-semibold mt-0.5">{macro.macro_headline}</p>
          </div>
        </div>

        {/* Severity Badge */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">IMD Weather Severity</span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#002970] border border-blue-200">
            {(macro.weather_severity_index * 100).toFixed(0)}% Disruption
          </span>
        </div>
      </div>

      {/* Simplified Clean Peer Cluster Visualization in Paytm Blue */}
      <div className="my-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-[#002970]" />
            Local Peer Cluster ({peer_cluster_summary.total_shops} Shops within 300m)
          </span>
          <span className="font-mono text-xs font-bold text-[#002970]">
            {peer_cluster_summary.affected_shops}/{peer_cluster_summary.total_shops} Shops Dipped ({peer_cluster_summary.affected_pct.toFixed(0)}%)
          </span>
        </div>

        {/* Clean Progress Meter Bar in Paytm Cyan & Navy */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-200">
          <div
            style={{ width: `${peer_cluster_summary.affected_pct}%` }}
            className={`transition-all duration-500 ${
              isFraudDivergence
                ? 'bg-rose-500'
                : 'bg-[#002970]'
            }`}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>{merchantName} (-45% Dip)</span>
          <span className="text-[#002970] font-medium">Average Peer Dip: -{peer_cluster_summary.avg_dip_pct.toFixed(0)}%</span>
        </div>
      </div>

      {/* Verification Conclusion Badge in Paytm Corporate Blue */}
      <div className="pt-2.5 border-t border-slate-100">
        {isVerifiedShock ? (
          <div className="flex items-start gap-2 rounded-lg bg-blue-50/70 p-2.5 border border-blue-200 text-[#002970]">
            <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#002970]" />
            <div className="text-xs">
              <span className="font-bold block">
                ✓ Verified Regional Shock — Zero Cash Diversion Fraud
              </span>
              <span className="text-slate-600 text-[11px]">
                83% of nearby stores experienced parallel drops due to heavy rains and drainage excavation. Legitimate borrower distress confirmed.
              </span>
            </div>
          </div>
        ) : isFraudDivergence ? (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200 text-rose-900">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-600" />
            <div className="text-xs">
              <span className="font-bold block">
                ⚠️ Severe Peer Divergence — QR Suppression or Abandonment
              </span>
              <span className="text-slate-600 text-[11px]">
                98% of local peers are trading normally while this account has been ₹0 for 25 days. Autonomous recovery blocked; routed to field DRA.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-slate-800">
            <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#002970]" />
            <div className="text-xs">
              <span className="font-bold block">✓ Normal Commercial Trading Corridor</span>
              <span className="text-slate-600 text-[11px]">
                Neighboring merchants show stable transaction flow. Isolated to bank CBS timeout.
              </span>
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};
