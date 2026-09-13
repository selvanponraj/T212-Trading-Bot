import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Trade } from '../types';

interface TradeTableProps {
    trades: Trade[];
    limit?: number;
}

export default function TradeTable({ trades, limit }: TradeTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const displayed = limit ? trades.slice(-limit).reverse() : [...trades].reverse();

    if (displayed.length === 0) {
        return (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <p className="text-gray-500 text-center py-8">No trades yet</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-800">
                        <th className="text-left p-4 text-gray-400 font-medium"></th>
                        <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Ticker</th>
                        <th className="text-left p-4 text-gray-400 font-medium">Action</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Qty</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Price</th>
                        <th className="text-right p-4 text-gray-400 font-medium">P&L</th>
                        <th className="text-right p-4 text-gray-400 font-medium">Confidence</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {displayed.map((trade) => (
                        <>
                            <tr
                                key={trade.id}
                                className="hover:bg-gray-800 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                            >
                                <td className="p-4 text-gray-500">
                                    {expandedId === trade.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </td>
                                <td className="p-4 text-gray-300">{new Date(trade.time).toLocaleString()}</td>
                                <td className="p-4 text-white font-medium">{trade.yf_symbol}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${trade.action === 'BUY'
                                                ? 'bg-emerald-900 text-emerald-300'
                                                : 'bg-red-900 text-red-300'
                                            }`}
                                    >
                                        {trade.action}
                                    </span>
                                </td>
                                <td className="p-4 text-right text-gray-300">{trade.quantity}</td>
                                <td className="p-4 text-right text-gray-300">${trade.price.toFixed(2)}</td>
                                <td
                                    className={`p-4 text-right font-medium ${trade.pnl === null
                                            ? 'text-gray-500'
                                            : trade.pnl >= 0
                                                ? 'text-emerald-400'
                                                : 'text-red-400'
                                        }`}
                                >
                                    {trade.pnl !== null ? `$${trade.pnl.toFixed(2)}` : '—'}
                                </td>
                                <td className="p-4 text-right text-gray-300">
                                    {trade.confidence !== null ? `${(trade.confidence * 100).toFixed(0)}%` : '—'}
                                </td>
                            </tr>
                            {expandedId === trade.id && (
                                <tr key={`${trade.id}-detail`}>
                                    <td colSpan={8} className="p-4 bg-gray-800/50">
                                        <p className="text-sm text-gray-300 mb-2">
                                            <span className="text-gray-500">AI Reasoning: </span>
                                            {trade.reasoning}
                                        </p>
                                        {trade.indicators && (
                                            <div className="flex gap-4 text-xs text-gray-400">
                                                <span>RSI: {trade.indicators.rsi_14}</span>
                                                <span>MACD: {trade.indicators.macd}</span>
                                                <span>BB%: {trade.indicators.bb_pct}</span>
                                                <span>Trend: {trade.indicators.ema_trend}</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
