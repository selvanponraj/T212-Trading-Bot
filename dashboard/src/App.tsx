import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PositionsPage from './pages/PositionsPage';
import TradeHistoryPage from './pages/TradeHistoryPage';
import PerformancePage from './pages/PerformancePage';
import ModelInsightsPage from './pages/ModelInsightsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/positions" element={<PositionsPage />} />
        <Route path="/trades" element={<TradeHistoryPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/insights" element={<ModelInsightsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
