const WEEKS_TO_SHOW = 4;

export function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export function getProgressWindowStart(referenceDate = new Date()) {
  const start = startOfWeek(referenceDate);
  start.setDate(start.getDate() - (WEEKS_TO_SHOW - 1) * 7);
  return start;
}

export function buildWeeklyProgress(sessions, referenceDate = new Date()) {
  const firstWeek = getProgressWindowStart(referenceDate);
  const weeks = Array.from({ length: WEEKS_TO_SHOW }, (_, index) => {
    const start = new Date(firstWeek);
    start.setDate(start.getDate() + index * 7);
    return { start, workouts: 0, volumeKg: 0 };
  });

  for (const session of sessions) {
    if (session.status && session.status !== 'COMPLETED') continue;

    const sessionDate = new Date(session.startTime);
    if (Number.isNaN(sessionDate.getTime())) continue;

    const weekIndex = Math.round(
      (startOfWeek(sessionDate).getTime() - firstWeek.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    if (weekIndex < 0 || weekIndex >= weeks.length) continue;

    const volume = Number(session.totalVolumeKg);
    weeks[weekIndex].workouts += 1;
    weeks[weekIndex].volumeKg += Number.isFinite(volume) && volume > 0 ? volume : 0;
  }

  return weeks;
}
