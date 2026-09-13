export interface Position {
  ticker: string;
  quantity: number;
  entry_price: number;
  entry_time: string;
  stop_loss: number;
  take_profit: number;
}

export interface Trade {
  id: string;
  ticker: string;
  yf_symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  value: number;
  time: string;
  reasoning: string;
  confidence: number | null;
  indicators: IndicatorSnapshot | null;
  stop_loss: number | null;
  take_profit: number | null;
  pnl: number | null;
}

export interface IndicatorSnapshot {
  rsi_14: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
  bb_pct: number;
  ema_trend: 'bullish' | 'bearish';
}

export interface FullIndicators {
  current_price: number;
  rsi_14: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  bb_pct: number;
  ema_9: number;
  ema_21: number;
  ema_trend: 'bullish' | 'bearish';
  volume: number;
  price_change_pct: number;
}

export interface DailySummary {
  date: string;
  pnl: number;
  cumulative_pnl: number;
  trades_count: number;
  buys: number;
  sells: number;
  wins: number;
  losses: number;
  win_rate: number;
  best_trade_pnl: number;
  worst_trade_pnl: number;
  positions_open: number;
}

export interface Decision {
  ticker: string;
  yf_symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  was_executed: boolean;
  rejection_reason: string | null;
  indicators: FullIndicators | null;
}

export interface LatestDecisions {
  run_time: string | null;
  decisions: Decision[];
}

export interface BotState {
  positions: Position[];
  daily_pnl: number;
  trading_day: string | null;
  trade_history: unknown[];
  last_run: string | null;
}
