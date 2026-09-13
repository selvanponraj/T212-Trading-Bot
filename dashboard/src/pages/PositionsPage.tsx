import { useData } from '../hooks/useData';
import PositionCard from '../components/PositionCard';
import type { BotState } from '../types';

export default function PositionsPage() {
  const { data: state } = useData<BotState>('state', {
    positions: [],
    daily_pnl: 0,
    trading_day: null,
    trade_history: [],
    last_run: null,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Open Positions</h2>
      {state.positions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <p className="text-gray-500">No open positions</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {state.positions.map((pos) => (
            <PositionCard key={pos.ticker} position={pos} />
          ))}
        </div>
      )}
    </div>
  );
}
