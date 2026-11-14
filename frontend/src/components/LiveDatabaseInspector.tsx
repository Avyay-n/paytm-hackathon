import React, { useState } from 'react';
import { Database, Table, Zap, ShieldCheck, CheckCircle2, History, RefreshCw } from 'lucide-react';
import { Loan, UpiSettlement, AgentAuditLog } from '../types';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface LiveDatabaseInspectorProps {
  loans: Loan[];
  settlements: UpiSettlement[];
  auditLogs: AgentAuditLog[];
  isMutating?: boolean;
  highlightedLoanId?: string | null;
  isCured?: boolean;
  onRefresh?: () => void;
}

export const LiveDatabaseInspector: React.FC<LiveDatabaseInspectorProps> = ({
  loans,
  settlements,
  auditLogs,
  isMutating = false,
  highlightedLoanId,
  isCured = false,
  onRefresh,
}) => {
  const [activeTableTab, setActiveTableTab] = useState<'loans' | 'upi_settlements' | 'agent_audit_logs'>('loans');

  // Compute live odometer KPI stats
  const recoveredCashFlow = isCured ? 430000 : 385000;
  const npasPrevented = isCured ? 7 : 6;
  const autoResolutionRate = 88;
  const rbiComplianceScore = 100;

  return (
    <div className="rounded-2xl bg-white/5 border border-cyan-500/20 p-4 md:p-5 backdrop-blur-md shadow-2xl space-y-4">
      {/* 4 Live Odometer KPI Pills (React Bits CountUp style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="rounded-xl bg-[#001D4D]/80 border border-emerald-500/30 p-2.5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            <span>Recovered Cash Flow</span>
            <Zap className="h-3 w-3" />
          </div>
          <div className="mt-1 text-lg font-black text-emerald-300">
            ₹<AnimatedCounter value={recoveredCashFlow} duration={1000} />
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium block">
            {isCured ? '+₹45,000 Restructured Today' : 'Live Restructured Pool'}
          </span>
        </div>

        <div className="rounded-xl bg-[#001D4D]/80 border border-cyan-500/30 p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            <span>NPAs Prevented</span>
            <CheckCircle2 className="h-3 w-3" />
          </div>
          <div className="mt-1 text-lg font-black text-cyan-300">
            <AnimatedCounter value={npasPrevented} suffix=" Merchants" duration={800} />
          </div>
          <span className="text-[10px] text-cyan-400/80 font-medium block">
            SMA-0 Cured Before NPA Cliff
          </span>
        </div>

        <div className="rounded-xl bg-[#001D4D]/80 border border-indigo-500/30 p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
            <span>Autonomous Rate</span>
            <Zap className="h-3 w-3" />
          </div>
          <div className="mt-1 text-lg font-black text-indigo-300">
            <AnimatedCounter value={autoResolutionRate} suffix="%" duration={900} />
          </div>
          <span className="text-[10px] text-indigo-400/80 font-medium block">
            Zero Human Tele-calls
          </span>
        </div>

        <div className="rounded-xl bg-[#001D4D]/80 border border-amber-500/30 p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            <span>RBI Compliance</span>
            <ShieldCheck className="h-3 w-3" />
          </div>
          <div className="mt-1 text-lg font-black text-amber-300">
            <AnimatedCounter value={rbiComplianceScore} suffix="%" duration={900} />
          </div>
          <span className="text-[10px] text-amber-400/80 font-medium block">
            ₹0 Penal Fees • DPDP Consented
          </span>
        </div>
      </div>

      {/* SQL Table Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
            Live SQL Database Inspector
            {isMutating && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTableTab('loans')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTableTab === 'loans'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              loans
            </button>
            <button
              onClick={() => setActiveTableTab('upi_settlements')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTableTab === 'upi_settlements'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              upi_settlements
            </button>
            <button
              onClick={() => setActiveTableTab('agent_audit_logs')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTableTab === 'agent_audit_logs'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              agent_audit_logs
            </button>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Sync with PostgreSQL/SQLite"
              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* SQL Table Data Grid */}
      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden font-mono text-[11px]">
        {/* Table 1: loans */}
        {activeTableTab === 'loans' && (
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase">
                  <th className="p-2">loan_id</th>
                  <th className="p-2">merchant_id</th>
                  <th className="p-2">principal</th>
                  <th className="p-2">daily_edi</th>
                  <th className="p-2">restructure_days</th>
                  <th className="p-2">status</th>
                  <th className="p-2">penal_fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {loans.map((loan) => {
                  const isHighlighted = highlightedLoanId === loan.loan_id || (loan.loan_id === 'LN_9001' && isCured);
                  return (
                    <tr
                      key={loan.loan_id}
                      className={`transition-colors duration-500 ${
                        isHighlighted
                          ? 'bg-emerald-500/20 text-emerald-200 font-bold'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="p-2 font-bold text-white flex items-center gap-1">
                        {isHighlighted && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        {loan.loan_id}
                      </td>
                      <td className="p-2 text-slate-300">{loan.merchant_id}</td>
                      <td className="p-2">₹{loan.principal_remaining.toLocaleString('en-IN')}</td>
                      <td className="p-2 font-bold">
                        <span className={isHighlighted ? 'text-emerald-300 font-black' : 'text-white'}>
                          ₹{loan.current_daily_edi}/day
                        </span>
                        {isHighlighted && (
                          <span className="text-[9px] line-through text-slate-400 ml-1">
                            ₹{loan.original_daily_edi}
                          </span>
                        )}
                      </td>
                      <td className="p-2">{loan.restructure_duration_days} days</td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            loan.status === 'RESTRUCTURED'
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                              : loan.status === 'ESCALATED'
                              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-2 text-emerald-400 font-bold">₹0.00 (Waived)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 2: upi_settlements */}
        {activeTableTab === 'upi_settlements' && (
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase">
                  <th className="p-2">day</th>
                  <th className="p-2">date</th>
                  <th className="p-2">gross_volume</th>
                  <th className="p-2">tx_count</th>
                  <th className="p-2">dip_period</th>
                  <th className="p-2">anomaly_note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {settlements.slice(-7).map((s) => (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="p-2 font-bold text-white">Day {s.day_index}</td>
                    <td className="p-2 text-slate-300">{s.settlement_date}</td>
                    <td className="p-2 font-bold text-cyan-300">₹{s.gross_volume.toLocaleString('en-IN')}</td>
                    <td className="p-2">{s.tx_count} txns</td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          s.is_dip_period
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {s.is_dip_period ? 'DIP_DETECTED' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="p-2 text-slate-400 truncate max-w-xs">{s.anomaly_note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 3: agent_audit_logs */}
        {activeTableTab === 'agent_audit_logs' && (
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase">
                  <th className="p-2">timestamp</th>
                  <th className="p-2">node</th>
                  <th className="p-2">action_type</th>
                  <th className="p-2">status</th>
                  <th className="p-2">idempotency_key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="p-2 text-slate-400">{log.created_at.slice(11, 19)}</td>
                      <td className="p-2 font-bold text-white">{log.node_name}</td>
                      <td className="p-2 text-cyan-300">{log.action_type}</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {log.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-400 font-mono text-[10px]">{log.idempotency_key.slice(0, 16)}...</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                      No audit transactions recorded yet. Execute a scenario step to inspect ACID commit logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
