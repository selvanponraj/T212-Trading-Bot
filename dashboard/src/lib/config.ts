const GITHUB_OWNER = 'selvanponraj';
const GITHUB_REPO = 'T212-Trading-Bot';
const BRANCH = 'main';

const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}`;

export const DATA_URLS = {
  state: `${BASE_URL}/state.json`,
  trades: `${BASE_URL}/data/trades.json`,
  dailySummaries: `${BASE_URL}/data/daily_summaries.json`,
  latestDecisions: `${BASE_URL}/data/latest_decisions.json`,
} as const;
