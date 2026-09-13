import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { DailySummary } from '../types';

interface PnLChartProps {
    summaries: DailySummary[];
}

export default function PnLChart({ summaries }: PnLChartProps) {
    if (summaries.length === 0) {
        return (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Cumulative P&L</h3>
                <p className="text-gray-500 text-center py-12">No data yet — trades will appear here</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Cumulative P&L</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={summaries}>
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
                    <Line
                        type="monotone"
                        dataKey="cumulative_pnl"
                        stroke="#34D399"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
