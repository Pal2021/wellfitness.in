const DEFAULT_TARGET_SETS = 3;

export function getWorkoutProgress(exercises, loggedSets) {
  const targets = new Map();

  for (const exercise of exercises) {
    if (!exercise.id || targets.has(exercise.id)) continue;

    const configuredSets = Number(exercise.defaultSets);
    const target = Number.isInteger(configuredSets) && configuredSets > 0
      ? configuredSets
      : DEFAULT_TARGET_SETS;

    targets.set(exercise.id, target);
  }

  const completedByExercise = new Map();
  for (const set of loggedSets) {
    if (set.completed === false || !targets.has(set.exerciseId)) continue;
    completedByExercise.set(
      set.exerciseId,
      (completedByExercise.get(set.exerciseId) || 0) + 1,
    );
  }

  let targetSets = 0;
  let completedSets = 0;
  for (const [exerciseId, target] of targets) {
    targetSets += target;
    completedSets += Math.min(completedByExercise.get(exerciseId) || 0, target);
  }

  return {
    completedSets,
    targetSets,
    percentage: targetSets > 0 ? Math.round((completedSets / targetSets) * 100) : 0,
  };
}
