import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorkoutProgress } from './workoutProgress.js';

test('counts completed sets against each exercise target', () => {
  const exercises = [
    { id: 'bench', defaultSets: 2 },
    { id: 'row', defaultSets: 3 },
  ];
  const sets = [
    { exerciseId: 'bench', completed: true },
    { exerciseId: 'bench', completed: true },
    { exerciseId: 'bench', completed: true },
    { exerciseId: 'row', completed: false },
  ];

  assert.deepEqual(getWorkoutProgress(exercises, sets), {
    completedSets: 2,
    targetSets: 5,
    percentage: 40,
  });
});

test('uses three sets per freestyle exercise', () => {
  assert.deepEqual(getWorkoutProgress([{ id: 'curl' }], [{ exerciseId: 'curl' }]), {
    completedSets: 1,
    targetSets: 3,
    percentage: 33,
  });
});

test('returns zero progress before an exercise is added', () => {
  assert.deepEqual(getWorkoutProgress([], []), {
    completedSets: 0,
    targetSets: 0,
    percentage: 0,
  });
});
