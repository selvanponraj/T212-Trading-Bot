import type { Decision } from '../types';

interface DecisionCardProps {
    decision: Decision;
}

export default function DecisionCard({ decision }: DecisionCardProps) {
    const actionColors = {
        BUY: 'bg-emerald-900 text-emerald-300',
        SELL: 'bg-red-900 text-red-300',
        HOLD: 'bg-gray-700 text-gray-300',
    };

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{decision.yf_symbol}</h3>
                    <span className="text-xs text-gray-500">{decision.ticker}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${actionColors[decision.action]}`}>
                    {decision.action}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-gray-300">{(decision.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full">
                    <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${decision.confidence * 100}%` }}
                    />
                </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{decision.reasoning}</p>

            <div className="mb-4">
                {decision.was_executed ? (
                    <span className="text-xs text-emerald-400">Executed</span>
                ) : (
                    <span className="text-xs text-gray-500">
                        Not executed: {decision.rejection_reason}
                    </span>
                )}
            </div>

            {decision.indicators && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Price</span>
                        <span className="text-gray-300">${decision.indicators.current_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">RSI(14)</span>
                        <span className="text-gray-300">{decision.indicators.rsi_14}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">MACD</span>
                        <span className="text-gray-300">{decision.indicators.macd}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">BB %B</span>
                        <span className="text-gray-300">{decision.indicators.bb_pct}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">EMA Trend</span>
                        <span
                            className={decision.indicators.ema_trend === 'bullish' ? 'text-emerald-400' : 'text-red-400'}
                        >
                            {decision.indicators.ema_trend}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Volume</span>
                        <span className="text-gray-300">{(decision.indicators.volume / 1e6).toFixed(1)}M</span>
                    </div>
                </div>
            )}
        </div>
    );
}
