import { getDashboard, getPRs, getWorkoutHistory } from '../../../services/apiClient';
import { getProgressWindowStart } from '../utils/progressMetrics';

const PAGE_SIZE = 50;

async function getSessionsSince(startDate) {
  const sessions = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await getWorkoutHistory(page, PAGE_SIZE);
    const batch = response.data?.data || [];
    if (batch.length === 0) break;

    sessions.push(...batch.filter((session) => new Date(session.startTime) >= startDate));
    hasNext = Boolean(response.data?.pagination?.hasNext)
      && new Date(batch[batch.length - 1].startTime) >= startDate;
    page += 1;
  }

  return sessions;
}

export async function getProgressData(referenceDate = new Date()) {
  const [dashboardResponse, recordsResponse, sessions] = await Promise.all([
    getDashboard(),
    getPRs(),
    getSessionsSince(getProgressWindowStart(referenceDate)),
  ]);

  return {
    dashboard: dashboardResponse.data?.data || {},
    records: recordsResponse.data?.data || [],
    sessions,
  };
}
