import { useData } from '../hooks/useData';
import PerformanceCharts from '../components/PerformanceCharts';
import type { DailySummary, Trade } from '../types';

export default function PerformancePage() {
  const { data: summaries } = useData<DailySummary[]>('dailySummaries', []);
  const { data: trades } = useData<Trade[]>('trades', []);

  const closedTrades = trades.filter((t) => t.pnl !== null);
  const totalTrades = closedTrades.length;
  const wins = closedTrades.filter((t) => t.pnl! > 0).length;
  const losses = closedTrades.filter((t) => t.pnl! <= 0).length;

  const avgProfit =
    wins > 0
      ? closedTrades
          .filter((t) => t.pnl! > 0)
          .reduce((s, t) => s + t.pnl!, 0) / wins
      : 0;

  const avgLoss =
    losses > 0
      ? closedTrades
          .filter((t) => t.pnl! <= 0)
          .reduce((s, t) => s + t.pnl!, 0) / losses
      : 0;

  const bestTrade = closedTrades.length > 0 ? Math.max(...closedTrades.map((t) => t.pnl!)) : 0;
  const worstTrade = closedTrades.length > 0 ? Math.min(...closedTrades.map((t) => t.pnl!)) : 0;

  const stats = [
    { label: 'Total Trades', value: `${totalTrades}` },
    { label: 'Wins', value: `${wins}`, color: 'text-emerald-400' },
    { label: 'Losses', value: `${losses}`, color: 'text-red-400' },
    {
      label: 'Win Rate',
      value: totalTrades > 0 ? `${((wins / totalTrades) * 100).toFixed(1)}%` : '0%',
    },
    { label: 'Avg Profit', value: `$${avgProfit.toFixed(2)}`, color: 'text-emerald-400' },
    { label: 'Avg Loss', value: `$${avgLoss.toFixed(2)}`, color: 'text-red-400' },
    { label: 'Best Trade', value: `$${bestTrade.toFixed(2)}`, color: 'text-emerald-400' },
    { label: 'Worst Trade', value: `$${worstTrade.toFixed(2)}`, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Performance</h2>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <PerformanceCharts summaries={summaries} />
    </div>
  );
}
