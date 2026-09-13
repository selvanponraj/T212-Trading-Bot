import type { Position } from '../types';

interface PositionCardProps {
    position: Position;
}

export default function PositionCard({ position }: PositionCardProps) {
    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{position.ticker.replace('_US_EQ', '')}</h3>
                <span className="text-xs text-gray-500">{new Date(position.entry_time).toLocaleDateString()}</span>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-white">{position.quantity}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Entry Price</span>
                    <span className="text-white">${position.entry_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Stop Loss</span>
                    <span className="text-red-400">${position.stop_loss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Take Profit</span>
                    <span className="text-emerald-400">${position.take_profit.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
