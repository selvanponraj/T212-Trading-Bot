import { useData } from '../hooks/useData';
import TradeTable from '../components/TradeTable';
import type { Trade } from '../types';

export default function TradeHistoryPage() {
  const { data: trades } = useData<Trade[]>('trades', []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Trade History</h2>
        <span className="text-sm text-gray-500">{trades.length} total trades</span>
      </div>
      <TradeTable trades={trades} />
    </div>
  );
}
