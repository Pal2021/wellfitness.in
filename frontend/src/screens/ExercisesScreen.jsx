import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import { colors } from '../theme';
import api from '../services/api';

const MUSCLE_GROUPS = ['ALL', 'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'CORE'];

export default function ExercisesScreen() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '', muscleGroup: 'CHEST', equipment: 'BARBELL',
    difficulty: 'INTERMEDIATE', isCompound: false, instructions: '',
    secondaryMuscles: '',
  });

  const loadExercises = () => {
    setLoading(true);
    const params = {};
    if (filter && filter !== 'ALL') params.muscle_group = filter;
    if (search) params.search = search;
    api.get('/exercises', { params }).then(r => {
      setExercises(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadExercises(); }, [filter, search]);

  const badgeColor = (mg) => {
    const map = { CHEST: 'amber', BACK: 'blue', LEGS: 'green', SHOULDERS: 'purple',
                  BICEPS: 'gold', TRICEPS: 'red', CORE: 'amber' };
    return map[mg] || 'amber';
  };

  const inputStyle = {
    width: '100%', background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
    borderRadius: 10, padding: '10px 12px', fontSize: 13, color: colors.TEXT_PRIMARY,
    outline: 'none', marginBottom: 8,
  };

  // ─── Exercise Detail View ───
  if (showDetail) {
    return (
      <div style={{ paddingBottom: 20 }}>
        <PageHeader title={showDetail.name} subtitle={showDetail.muscleGroup} />
        <div style={{ padding: '0 14px', animation: 'fadeIn 0.3s ease' }}>
          <AppCard style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Badge label={showDetail.muscleGroup} variant={badgeColor(showDetail.muscleGroup)} />
              <Badge label={showDetail.equipment} variant="blue" />
              <Badge label={showDetail.difficulty} variant="purple" />
              {showDetail.isCompound && <Badge label="COMPOUND" variant="gold" />}
            </div>
            {showDetail.secondaryMuscles && (
              <div style={{ fontSize: 12, color: colors.TEXT_SECONDARY, marginBottom: 8 }}>
                <strong>Secondary:</strong> {showDetail.secondaryMuscles}
              </div>
            )}
            {showDetail.instructions && (
              <div style={{ fontSize: 12, color: colors.TEXT_SECONDARY, lineHeight: 1.6 }}>
                <strong>Instructions:</strong><br />{showDetail.instructions}
              </div>
            )}
          </AppCard>
          <AppButton label="← Back" variant="ghost" onClick={() => setShowDetail(null)} />
        </div>

      </div>
    );
  }

  // ─── Add Custom Exercise Form ───
  if (showAddForm) {
    return (
      <div style={{ paddingBottom: 20 }}>
        <PageHeader title="Add Exercise" subtitle="Create a custom exercise" />
        <div style={{ padding: '0 14px', animation: 'fadeIn 0.3s ease' }}>
          <AppCard style={{ padding: 16 }}>
            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Exercise Name *</label>
            <input value={newExercise.name} onChange={e => setNewExercise(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Cable Lateral Raise" style={inputStyle} />

            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Muscle Group *</label>
            <select value={newExercise.muscleGroup} onChange={e => setNewExercise(p => ({ ...p, muscleGroup: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}>
              {['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'CORE'].map(mg =>
                <option key={mg} value={mg}>{mg}</option>
              )}
            </select>

            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Equipment *</label>
            <select value={newExercise.equipment} onChange={e => setNewExercise(p => ({ ...p, equipment: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}>
              {['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BODYWEIGHT', 'KETTLEBELL', 'BAND', 'OTHER'].map(eq =>
                <option key={eq} value={eq}>{eq}</option>
              )}
            </select>

            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Difficulty</label>
            <select value={newExercise.difficulty} onChange={e => setNewExercise(p => ({ ...p, difficulty: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none' }}>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(d =>
                <option key={d} value={d}>{d}</option>
              )}
            </select>

            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Secondary Muscles</label>
            <input value={newExercise.secondaryMuscles}
              onChange={e => setNewExercise(p => ({ ...p, secondaryMuscles: e.target.value }))}
              placeholder="e.g. Triceps, Shoulders" style={inputStyle} />

            <label style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontWeight: 700 }}>Instructions</label>
            <textarea value={newExercise.instructions}
              onChange={e => setNewExercise(p => ({ ...p, instructions: e.target.value }))}
              placeholder="How to perform this exercise..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input type="checkbox" checked={newExercise.isCompound}
                onChange={e => setNewExercise(p => ({ ...p, isCompound: e.target.checked }))} />
              <span style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Compound exercise</span>
            </div>
          </AppCard>

          <div style={{ display: 'flex', gap: 8 }}>
            <AppButton label="Save Exercise" onClick={async () => {
              if (!newExercise.name) { alert('Name is required'); return; }
              try {
                await api.post('/exercises', newExercise);
                setShowAddForm(false);
                setNewExercise({ name: '', muscleGroup: 'CHEST', equipment: 'BARBELL',
                  difficulty: 'INTERMEDIATE', isCompound: false, instructions: '', secondaryMuscles: '' });
                loadExercises();
              } catch (e) {
                alert(e.response?.data?.message || 'Failed to save exercise');
              }
            }} style={{ flex: 1 }} />
            <AppButton label="Cancel" variant="ghost" onClick={() => setShowAddForm(false)} style={{ flex: 1 }} />
          </div>
        </div>

      </div>
    );
  }

  // ─── Main Exercise List ───
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Exercises</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{exercises.length} exercises</div>
          </div>
          <div onClick={() => setShowAddForm(true)} style={{
            padding: '6px 12px', borderRadius: 10, fontSize: 10, fontWeight: 800,
            background: colors.AMBER_DIM, border: `0.5px solid ${colors.AMBER_GLOW}`,
            color: colors.AMBER, cursor: 'pointer',
          }}>+ Add</div>
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <input
          placeholder="🔍 Search exercises..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
            borderRadius: 12, padding: '11px 14px', fontSize: 13, color: colors.TEXT_PRIMARY, outline: 'none',
            marginBottom: 10,
          }}
        />

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 4, scrollbarWidth: 'none' }}>
          {MUSCLE_GROUPS.map(mg => (
            <div key={mg} onClick={() => setFilter(mg)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
              background: filter === mg ? colors.AMBER_DIM : colors.BG_SECONDARY,
              color: filter === mg ? colors.AMBER : colors.TEXT_SECONDARY,
              border: filter === mg ? `1px solid ${colors.AMBER}` : `0.5px solid ${colors.BORDER_DEFAULT}`,
            }}>{mg}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: colors.TEXT_TERTIARY, animation: 'pulse 1.5s infinite' }}>Loading...</div>
        ) : (
          exercises.map(ex => (
            <AppCard key={ex.id} onClick={() => setShowDetail(ex)}
              style={{ padding: '10px 14px', animation: 'fadeIn 0.3s ease', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>
                    {ex.equipment} · {ex.difficulty}
                    {ex.isCompound && ' · Compound'}
                  </div>
                  {ex.secondaryMuscles && (
                    <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
                      Also: {ex.secondaryMuscles}
                    </div>
                  )}
                </div>
                <Badge label={ex.muscleGroup} variant={badgeColor(ex.muscleGroup)} />
              </div>
            </AppCard>
          ))
        )}
      </div>


    </div>
  );
}
