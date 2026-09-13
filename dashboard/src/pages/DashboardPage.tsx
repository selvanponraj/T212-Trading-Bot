import { useData } from '../hooks/useData';
import PnLChart from '../components/PnLChart';
import SummaryCards from '../components/SummaryCards';
import TradeTable from '../components/TradeTable';
import type { BotState, DailySummary, Trade } from '../types';

export default function DashboardPage() {
    const { data: state } = useData<BotState>('state', {
        positions: [],
        daily_pnl: 0,
        trading_day: null,
        trade_history: [],
        last_run: null,
    });
    const { data: summaries } = useData<DailySummary[]>('dailySummaries', []);
    const { data: trades } = useData<Trade[]>('trades', []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <span className="text-xs text-gray-500">
                    Last run: {state.last_run ? new Date(state.last_run).toLocaleString() : 'Never'}
                </span>
            </div>
            <SummaryCards summaries={summaries} state={state} />
            <PnLChart summaries={summaries} />
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Trades</h3>
                <TradeTable trades={trades} limit={10} />
            </div>
        </div>
    );
}
