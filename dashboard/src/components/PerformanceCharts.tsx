import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { DailySummary } from '../types';

interface PerformanceChartsProps {
    summaries: DailySummary[];
}

export default function PerformanceCharts({ summaries }: PerformanceChartsProps) {
    const totalWins = summaries.reduce((s, d) => s + d.wins, 0);
    const totalLosses = summaries.reduce((s, d) => s + d.losses, 0);
    const pieData = [
        { name: 'Wins', value: totalWins },
        { name: 'Losses', value: totalLosses },
    ];
    const PIE_COLORS = ['#34D399', '#F87171'];

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Daily P&L</h3>
                {summaries.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No data yet</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={summaries}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F3F4F6',
                                }}
                            />
                            <Bar dataKey="pnl">
                                {summaries.map((entry, index) => (
                                    <Cell key={index} fill={entry.pnl >= 0 ? '#34D399' : '#F87171'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Win / Loss Ratio</h3>
                {totalWins + totalLosses === 0 ? (
                    <p className="text-gray-500 text-center py-12">No data yet</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F3F4F6',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
