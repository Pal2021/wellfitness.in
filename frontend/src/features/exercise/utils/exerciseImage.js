import photoSources from '../data/exercisePhotoSources.json';

export function getExerciseImage(exercise) {
  if (!exercise) return '';
  if (!exercise.userId && Object.hasOwn(photoSources, exercise.name)) {
    const filename = exercise.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `/exercise-images/${filename}.jpg`;
  }
  return exercise.imageUrl || '';
}
