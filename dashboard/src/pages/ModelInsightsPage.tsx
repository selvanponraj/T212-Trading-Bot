import { useData } from '../hooks/useData';
import DecisionCard from '../components/DecisionCard';
import type { LatestDecisions } from '../types';

export default function ModelInsightsPage() {
  const { data } = useData<LatestDecisions>('latestDecisions', {
    run_time: null,
    decisions: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Model Insights</h2>
        <span className="text-sm text-gray-500">
          Last analysis: {data.run_time ? new Date(data.run_time).toLocaleString() : 'Never'}
        </span>
      </div>

      {data.decisions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <p className="text-gray-500">No decisions yet — waiting for first bot run</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data.decisions.map((decision) => (
            <DecisionCard key={decision.ticker} decision={decision} />
          ))}
        </div>
      )}
    </div>
  );
}
