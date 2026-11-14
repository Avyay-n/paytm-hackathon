import React from 'react';
import { CloudRain, AlertTriangle, ShieldCheck, MapPin, Radio, Activity } from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';
import { BorderBeam } from './ui/BorderBeam';
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
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="h-4 w-4 animate-spin text-[#00BAF2]" />
          <span className="text-xs">Loading regional telemetry & peer radar...</span>
        </div>
      </SpotlightCard>
    );
  }

  const { macro, peer_nodes, peer_cluster_summary } = radarData;
  const isVerifiedShock = macro.verified_external_shock;
  const isFraudDivergence = peer_cluster_summary.affected_pct < 10 && macro.weather_severity_index < 0.2;

  return (
    <SpotlightCard className="p-4 relative">
      {isVerifiedShock && <BorderBeam colorFrom="#10B981" colorTo="#00BAF2" duration={10} />}
      {isFraudDivergence && <BorderBeam colorFrom="#EF4444" colorTo="#F59E0B" duration={4} />}

      {/* Header with Pin Code and Macro Signal */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#00BAF2]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white">
                Pin Code {macro.pin_code}
              </span>
              <span className="text-xs text-slate-400">({macro.city})</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">{macro.macro_headline}</p>
          </div>
        </div>

        {/* Severity Badge */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">IMD Severity</span>
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
            macro.weather_severity_index > 0.6
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {(macro.weather_severity_index * 100).toFixed(0)}% Impact
          </span>
        </div>
      </div>

      {/* Radar Visual: 24 Mini Merchant Nodes */}
      <div className="my-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-[#00BAF2] animate-pulse" />
            Hyper-Local Merchant Cluster ({peer_cluster_summary.total_shops} Shops within 300m)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {peer_cluster_summary.affected_shops}/{peer_cluster_summary.total_shops} Dipped ({peer_cluster_summary.affected_pct.toFixed(1)}%)
          </span>
        </div>

        {/* 24 Node Grid */}
        <div className="grid grid-cols-8 gap-1.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
          {peer_nodes.map((node, i) => (
            <div
              key={node.id}
              title={`${node.id} (${node.category}): ${node.status} (-${node.dip_pct}%)`}
              className={`group relative flex h-7 items-center justify-center rounded transition-all duration-300 ${
                node.is_down
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:scale-110'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:scale-110'
              }`}
            >
              <span className="text-[9px] font-mono font-bold">
                {i === 0 ? '★' : `${i + 1}`}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-1 text-[10px] text-slate-400 text-center">
          Node ★: {merchantName} | Nodes 2–24: Neighboring Kiranas, Pharmacies & Retailers
        </p>
      </div>

      {/* Verification Conclusion Badge */}
      <div className="pt-2 border-t border-slate-800">
        {isVerifiedShock ? (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20 text-emerald-300">
            <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold block">
                [✓ VERIFIED REGIONAL SHOCK — ZERO CASH DIVERSION FRAUD]
              </span>
              <span className="text-slate-300 text-[11px]">
                83.3% of peer merchants also dropped by ~41%. Drop is driven by monsoon inundation and roadwork, not borrower intent.
              </span>
            </div>
          </div>
        ) : isFraudDivergence ? (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-2.5 border border-red-500/30 text-red-300 animate-pulse">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
            <div className="text-xs">
              <span className="font-bold block">
                [!] SEVERE PEER DIVERGENCE — CASH DIVERSION OR ABANDONMENT
              </span>
              <span className="text-slate-300 text-[11px]">
                97.9% of local merchants report booming collections while this shop dropped to ₹0 for 25 days. Autonomous recovery blocked; routed to DRA.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg bg-[#00BAF2]/10 p-2.5 border border-[#00BAF2]/20 text-cyan-200">
            <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#00BAF2]" />
            <div className="text-xs">
              <span className="font-bold block">[✓ NORMAL COMMERCIAL CORRIDOR]</span>
              <span className="text-slate-300 text-[11px]">
                Regional settlement telemetry indicates stable footfall. Missed sweep isolated to bank switch timeout.
              </span>
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};
