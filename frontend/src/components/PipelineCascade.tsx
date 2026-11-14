import React from 'react';
import { Cpu, ShieldCheck, Mic, FileCheck, AlertOctagon, Clock } from 'lucide-react';
import { NodeResult } from '../types';

interface PipelineCascadeProps {
  nodes: NodeResult[];
  activeNodeId?: number;
}

export const PipelineCascade: React.FC<PipelineCascadeProps> = ({ nodes }) => {
  const getNodeIcon = (nodeId: number) => {
    switch (nodeId) {
      case 1:
        return <Cpu className="h-3.5 w-3.5" />;
      case 2:
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case 3:
        return <Mic className="h-3.5 w-3.5" />;
      case 4:
        return <FileCheck className="h-3.5 w-3.5" />;
      case 5:
        return <AlertOctagon className="h-3.5 w-3.5" />;
      default:
        return <Cpu className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#002970]" />
          5-Node Execution Pipeline Trace
        </h4>
        <span className="font-mono text-[11px] text-slate-400">Deterministic Flow</span>
      </div>

      <div className="space-y-2">
        {nodes.map((node) => {
          const isSuccess = node.status === 'SUCCESS';
          const isBlocked = node.status === 'BLOCKED';
          const isEscalated = node.status === 'ESCALATED';

          return (
            <div
              key={node.node_id}
              className={`flex items-start justify-between rounded-lg p-2.5 border text-xs transition-colors ${
                isSuccess
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : isBlocked
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : isEscalated
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1 rounded mt-0.5 ${
                  isSuccess
                    ? 'bg-emerald-100 text-emerald-800'
                    : isBlocked
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {getNodeIcon(node.node_id)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      Node {node.node_id}
                    </span>
                    <span className="font-bold text-slate-900">{node.node_name}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{node.headline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-[10px] text-slate-400">{node.latency_ms}ms</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  isSuccess
                    ? 'bg-emerald-100 text-emerald-800'
                    : isBlocked
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {node.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
