import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { getExerciseImage } from '../utils/exerciseImage';

export default function ExercisePhoto({ exercise, className = '', imageClassName = '', loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState('');
  const source = getExerciseImage(exercise);
  const showImage = source && failedSource !== source;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-[#282017] to-[#101010] ${className}`}>
      {showImage ? (
        <img
          src={source}
          alt={`${exercise.name} exercise demonstration`}
          loading={loading}
          onError={() => setFailedSource(source)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`No photo available for ${exercise?.name || 'this exercise'}`}>
          <Dumbbell className="text-amber-400/60" size={44} strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
