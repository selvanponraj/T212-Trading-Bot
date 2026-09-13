import type { BotState, DailySummary } from '../types';

interface SummaryCardsProps {
    summaries: DailySummary[];
    state: BotState;
}

export default function SummaryCards({ summaries, state }: SummaryCardsProps) {
    const latestSummary = summaries[summaries.length - 1];
    const cumulativePnl = latestSummary?.cumulative_pnl ?? 0;
    const todayPnl = state.daily_pnl;
    const totalWins = summaries.reduce((sum, s) => sum + s.wins, 0);
    const totalLosses = summaries.reduce((sum, s) => sum + s.losses, 0);
    const winRate =
        totalWins + totalLosses > 0
            ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
            : '0.0';

    const cards = [
        {
            label: 'Total P&L',
            value: `$${cumulativePnl.toFixed(2)}`,
            color: cumulativePnl >= 0 ? 'text-emerald-400' : 'text-red-400',
        },
        {
            label: "Today's P&L",
            value: `$${todayPnl.toFixed(2)}`,
            color: todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400',
        },
        {
            label: 'Win Rate',
            value: `${winRate}%`,
            color: 'text-blue-400',
        },
        {
            label: 'Open Positions',
            value: `${state.positions.length}`,
            color: 'text-blue-400',
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.label} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
            ))}
        </div>
    );
}
