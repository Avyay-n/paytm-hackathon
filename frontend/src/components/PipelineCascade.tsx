import React from 'react';
import { ShieldCheck, Cpu, Mic, FileCheck, AlertOctagon, CheckCircle, Clock } from 'lucide-react';
import { NodeResult } from '../types';
import { BorderBeam } from './ui/BorderBeam';
import { DecryptedText } from './ui/DecryptedText';

interface PipelineCascadeProps {
  nodes: NodeResult[];
  activeNodeId?: number;
}

export const PipelineCascade: React.FC<PipelineCascadeProps> = ({
  nodes,
  activeNodeId,
}) => {
  const getNodeIcon = (nodeId: number) => {
    switch (nodeId) {
      case 1:
        return <Cpu className="h-4 w-4" />;
      case 2:
        return <ShieldCheck className="h-4 w-4" />;
      case 3:
        return <Mic className="h-4 w-4" />;
      case 4:
        return <FileCheck className="h-4 w-4" />;
      case 5:
        return <AlertOctagon className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'BLOCKED':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'ESCALATED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-[#00BAF2] bg-[#00BAF2]/10 border-[#00BAF2]/30';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#00BAF2]" />
          5-Node Autonomous LSP Execution Cascade
        </h4>
        <span className="font-mono text-[11px] text-slate-400">
          Deterministic Pipeline Execution
        </span>
      </div>

      <div className="space-y-2">
        {nodes.map((node) => {
          const isActive = activeNodeId === node.node_id;
          const statusClass = getStatusColor(node.status);

          return (
            <div
              key={node.node_id}
              className={`relative overflow-hidden rounded-xl border bg-slate-900/90 p-3 transition-all duration-300 ${
                node.status === 'SUCCESS'
                  ? 'border-emerald-500/30'
                  : node.status === 'BLOCKED'
                  ? 'border-red-500/40 bg-red-950/20'
                  : node.status === 'ESCALATED'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              {isActive && <BorderBeam colorFrom="#00BAF2" colorTo="#FF6B35" duration={4} />}

              {/* Node Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${statusClass}`}>
                    {getNodeIcon(node.node_id)}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      NODE {node.node_id}
                    </span>
                    <span className="text-xs font-bold text-white">{node.node_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    <DecryptedText text={`${node.latency_ms}ms`} />
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${statusClass}`}
                  >
                    {node.status}
                  </span>
                </div>
              </div>

              {/* Headline & Summary */}
              <div className="mt-2 text-xs">
                <p className="font-semibold text-slate-200">{node.headline}</p>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                  {node.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
