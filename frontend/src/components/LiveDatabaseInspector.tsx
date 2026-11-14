import React, { useState } from 'react';
import { Database, Zap, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
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

  const recoveredCashFlow = isCured ? 430000 : 385000;
  const npasPrevented = isCured ? 7 : 6;
  const autoResolutionRate = 88;
  const rbiComplianceScore = 100;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0A224E]/90 to-[#071838]/90 border border-white/10 p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* 4 Live Odometer KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-3 shadow-sm relative overflow-hidden transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            <span>Recovered Cash Flow</span>
            <Zap className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xl font-black text-emerald-300 tracking-tight">
            <AnimatedCounter
              value={recoveredCashFlow}
              isCurrency={true}
              prefix="₹"
              duration={1000}
            />
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium block mt-0.5">
            {isCured ? '+₹45,000 Restructured Today' : 'Live Restructured Pool'}
          </span>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-3 shadow-sm relative overflow-hidden transition-all hover:border-cyan-500/30">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            <span>NPAs Prevented</span>
            <CheckCircle2 className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xl font-black text-cyan-300 tracking-tight">
            <AnimatedCounter value={npasPrevented} suffix=" Merchants" duration={800} />
          </div>
          <span className="text-[10px] text-cyan-400/80 font-medium block mt-0.5">
            SMA-0 Cured Before NPA Cliff
          </span>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-3 shadow-sm relative overflow-hidden transition-all hover:border-indigo-500/30">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
            <span>Autonomous Rate</span>
            <Zap className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xl font-black text-indigo-300 tracking-tight">
            <AnimatedCounter value={autoResolutionRate} suffix="%" duration={900} />
          </div>
          <span className="text-[10px] text-indigo-400/80 font-medium block mt-0.5">
            Zero Human Tele-calls
          </span>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl bg-[#001433]/70 border border-white/10 p-3 shadow-sm relative overflow-hidden transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            <span>RBI Compliance</span>
            <ShieldCheck className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xl font-black text-amber-300 tracking-tight">
            <AnimatedCounter value={rbiComplianceScore} suffix="%" duration={900} />
          </div>
          <span className="text-[10px] text-amber-400/80 font-medium block mt-0.5">
            ₹0 Penal Fees • DPDP Consented
          </span>
        </div>
      </div>

      {/* SQL Table Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
            Live SQL Database Inspector
            {isMutating && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTableTab('loans')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTableTab === 'loans'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              loans
            </button>
            <button
              onClick={() => setActiveTableTab('upi_settlements')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTableTab === 'upi_settlements'
                  ? 'bg-[#00BAF2] text-[#002970] shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              upi_settlements
            </button>
            <button
              onClick={() => setActiveTableTab('agent_audit_logs')}
              className={`px-3 py-1 rounded-lg transition-all ${
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
              title="Sync with SQL Engine"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SQL Table Data Grid */}
      <div className="rounded-xl border border-white/10 bg-[#001433]/80 overflow-hidden font-mono text-[11px]">
        {/* Table 1: loans */}
        {activeTableTab === 'loans' && (
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase tracking-wider">
                  <th className="p-2.5">loan_id</th>
                  <th className="p-2.5">merchant_id</th>
                  <th className="p-2.5">principal</th>
                  <th className="p-2.5">daily_edi</th>
                  <th className="p-2.5">restructure_days</th>
                  <th className="p-2.5">status</th>
                  <th className="p-2.5">penal_fee</th>
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
                      <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                        {isHighlighted && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                        {loan.loan_id}
                      </td>
                      <td className="p-2.5 text-slate-300">{loan.merchant_id}</td>
                      <td className="p-2.5">₹{loan.principal_remaining.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 font-bold">
                        <span className={isHighlighted ? 'text-emerald-300 font-black' : 'text-white'}>
                          ₹{loan.current_daily_edi}/day
                        </span>
                        {isHighlighted && (
                          <span className="text-[10px] line-through text-slate-400 ml-1.5">
                            ₹{loan.original_daily_edi}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5">{loan.restructure_duration_days} days</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            loan.status === 'RESTRUCTURED'
                              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                              : loan.status === 'ESCALATED'
                              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-emerald-400 font-bold">₹0.00 (Waived)</td>
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
                <tr className="bg-white/5 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase tracking-wider">
                  <th className="p-2.5">day</th>
                  <th className="p-2.5">date</th>
                  <th className="p-2.5">gross_volume</th>
                  <th className="p-2.5">tx_count</th>
                  <th className="p-2.5">dip_period</th>
                  <th className="p-2.5">anomaly_note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {settlements.slice(-7).map((s) => (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="p-2.5 font-bold text-white">Day {s.day_index}</td>
                    <td className="p-2.5 text-slate-300">{s.settlement_date}</td>
                    <td className="p-2.5 font-bold text-cyan-300">₹{s.gross_volume.toLocaleString('en-IN')}</td>
                    <td className="p-2.5">{s.tx_count} txns</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.is_dip_period
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {s.is_dip_period ? 'DIP_DETECTED' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 truncate max-w-xs">{s.anomaly_note || '—'}</td>
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
                <tr className="bg-white/5 text-cyan-300 font-bold border-b border-white/10 text-[10px] uppercase tracking-wider">
                  <th className="p-2.5">timestamp</th>
                  <th className="p-2.5">node</th>
                  <th className="p-2.5">action_type</th>
                  <th className="p-2.5">status</th>
                  <th className="p-2.5">idempotency_key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {auditLogs.length > 0 ? (
                  auditLogs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="p-2.5 text-slate-400">{log.created_at.slice(11, 19)}</td>
                      <td className="p-2.5 font-bold text-white">{log.node_name}</td>
                      <td className="p-2.5 text-cyan-300">{log.action_type}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {log.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-mono text-[10px]">{log.idempotency_key.slice(0, 16)}...</td>
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
