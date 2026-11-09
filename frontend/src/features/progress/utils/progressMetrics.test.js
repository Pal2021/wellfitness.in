import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyProgress, getProgressWindowStart } from './progressMetrics.js';

test('starts the four-week window on a Monday', () => {
  const start = getProgressWindowStart(new Date(2026, 10, 8));
  assert.equal(start.getFullYear(), 2026);
  assert.equal(start.getMonth(), 9);
  assert.equal(start.getDate(), 12);
});

test('groups completed sessions into the correct weeks', () => {
  const sessions = [
    { startTime: '2026-10-13T10:00:00', totalVolumeKg: 120, status: 'COMPLETED' },
    { startTime: '2026-11-02T10:00:00', totalVolumeKg: 75, status: 'COMPLETED' },
    { startTime: '2026-11-07T10:00:00', totalVolumeKg: 25, status: 'COMPLETED' },
    { startTime: '2026-11-07T12:00:00', totalVolumeKg: 500, status: 'ACTIVE' },
    { startTime: '2026-10-01T10:00:00', totalVolumeKg: 900, status: 'COMPLETED' },
  ];

  const weeks = buildWeeklyProgress(sessions, new Date(2026, 10, 8));
  assert.deepEqual(weeks.map(({ workouts, volumeKg }) => ({ workouts, volumeKg })), [
    { workouts: 1, volumeKg: 120 },
    { workouts: 0, volumeKg: 0 },
    { workouts: 0, volumeKg: 0 },
    { workouts: 2, volumeKg: 100 },
  ]);
});
