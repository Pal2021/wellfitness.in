import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, Dumbbell, Flame, History, LayoutList, LogOut, Moon, Pencil, RefreshCw, Ruler, Settings2, Sun, Target, Trophy, UserRound, Weight } from 'lucide-react';
import { useAuth } from '../../../common/context/AuthContext';
import { useTheme } from '../../../common/context/ThemeContext';
import { getDashboard, getPRs, getProfile, updateProfile } from '../../../services/apiClient';
import { getActiveUserSplit } from '../../split/services/splitService';
import ProfileEditor from '../components/ProfileEditor';
import ProfileTag from '../components/ProfileTag';
import QuickAction from '../components/QuickAction';
import SettingsItem from '../components/SettingsItem';
import StatCard from '../components/StatCard';

const goals = [
  { value: 'LOSE_WEIGHT', label: 'Lose weight', detail: 'Get leaner' },
  { value: 'GAIN_WEIGHT', label: 'Gain weight', detail: 'Build healthy body mass' },
  { value: 'BUILD_MUSCLE', label: 'Build muscle', detail: 'Grow stronger' },
  { value: 'GET_STRONGER', label: 'Get stronger', detail: 'Improve your lifts' },
  { value: 'STAY_FIT', label: 'Stay fit', detail: 'Feel your best' },
];
const panelStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' };

function Avatar({ name, photoUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name?.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'W';
  return <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-amber-500 text-2xl font-black text-black shadow-lg shadow-amber-500/15 sm:h-24 sm:w-24 sm:text-3xl">{photoUrl && !imageFailed ? <img src={photoUrl} alt="Profile" onError={() => setImageFailed(true)} className="h-full w-full object-cover" /> : initials}</div>;
}

function formatWeight(user) {
  const kg = Number(user?.bodyweightKg);
  if (!kg) return 'Add your weight';
  return user?.unitsWeight === 'LB' ? `${(kg * 2.20462).toFixed(1)} lb` : `${kg.toFixed(1)} kg`;
}

function formatHeight(user) {
  const cm = Number(user?.heightCm);
  if (!cm) return 'Add your height';
  return user?.unitsHeight === 'IN' ? `${(cm / 2.54).toFixed(1)} in` : `${cm} cm`;
}

function requestMessage(error) {
  return error?.response?.data?.message || error?.message || 'Could not save changes. Please try again.';
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({ workouts: null, streak: null, prs: null });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [splitName, setSplitName] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const [profileResult, dashboardResult, prsResult, splitResult] = await Promise.allSettled([
      getProfile(), getDashboard(), getPRs(), getActiveUserSplit(),
    ]);
    if (profileResult.status === 'fulfilled') updateUser(profileResult.value.data?.data || {});
    else setLoadError('Could not refresh your profile. Showing your last saved details.');
    setStats({
      workouts: dashboardResult.status === 'fulfilled' ? dashboardResult.value.data?.data?.totalWorkouts ?? 0 : null,
      streak: dashboardResult.status === 'fulfilled' ? dashboardResult.value.data?.data?.streak?.current ?? 0 : null,
      prs: prsResult.status === 'fulfilled' ? (prsResult.value.data?.data || []).length : null,
    });
    setSplitName(splitResult.status === 'fulfilled' ? splitResult.value?.name || null : null);
    if (dashboardResult.status === 'rejected' || prsResult.status === 'rejected' || splitResult.status === 'rejected') {
      setLoadError((current) => current || 'Some profile details could not load. Tap retry to refresh.');
    }
    setLoading(false);
  }, [updateUser]);

  useEffect(() => { load(); }, [load]);

  const saveChanges = async (changes) => {
    setSaving(true);
    setSaveError('');
    setFeedback('');
    try {
      const response = await updateProfile(changes);
      const updated = response.data?.data;
      if (updated && typeof updated === 'object') updateUser(updated);
      else {
        const fresh = await getProfile();
        updateUser(fresh.data?.data || changes);
      }
      setActiveEditor(null);
      setFeedback('Changes saved.');
    } catch (error) {
      setSaveError(requestMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const openEditor = (type) => {
    setSaveError('');
    setFeedback('');
    setActiveEditor(type);
  };

  const goalLabel = goals.find((goal) => goal.value === user?.goal)?.label || user?.goal?.replaceAll('_', ' ').toLowerCase();

  return (
    <div className="min-h-screen pb-32 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500"><UserRound size={16} aria-hidden="true" /> Your account</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Profile</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your training details and preferences, all in one place.</p>
        </header>

        {loadError && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm"><span>{loadError}</span><button type="button" onClick={load} className="inline-flex items-center gap-1 font-bold text-amber-500"><RefreshCw size={15} /> Retry</button></div>}
        {feedback && <p role="status" className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">{feedback}</p>}
        {saveError && !activeEditor && <p role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{saveError}</p>}

        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17110b] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-8">
          <div aria-hidden="true" className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <Avatar key={user?.profilePhotoUrl || 'avatar'} name={user?.name} photoUrl={user?.profilePhotoUrl} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">WellFitness member</p>
              <h2 className="mt-1 truncate text-2xl font-black tracking-tight sm:text-3xl">{user?.name || 'Your profile'}</h2>
              {user?.email && <p className="mt-1 truncate text-sm text-white/65">{user.email}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {user?.daysPerWeek > 0 && <ProfileTag label={`${user.daysPerWeek} days/week`} />}
                {user?.experience && <ProfileTag label={user.experience.toLowerCase()} />}
                {goalLabel && <ProfileTag label={goalLabel} />}
              </div>
            </div>
            <button type="button" onClick={() => openEditor('identity')} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-bold transition hover:bg-white/20 sm:w-auto sm:self-start"><Pencil size={16} aria-hidden="true" /> Edit profile</button>
          </div>
        </section>

        <section aria-label="Training statistics" className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard icon={Dumbbell} value={stats.workouts ?? '—'} label="Workouts" loading={loading} />
          <StatCard icon={Flame} value={stats.streak ?? '—'} label="Day streak" loading={loading} />
          <StatCard icon={Trophy} value={stats.prs ?? '—'} label="Records" loading={loading} />
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="space-y-8">
            <section aria-labelledby="profile-shortcuts-title">
              <h2 id="profile-shortcuts-title" className="mb-3 text-lg font-black">Your training</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <QuickAction icon={History} label="Workout history" detail="Review completed sessions" onClick={() => navigate('/workout/history')} />
                <QuickAction icon={LayoutList} label="My split" detail="Manage your training days" onClick={() => navigate('/splits')} />
              </div>
            </section>

            <section aria-labelledby="profile-goal-title" className="rounded-2xl border p-5 sm:p-6" style={panelStyle}>
              <div className="mb-4 flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><Target size={20} /></span><div><h2 id="profile-goal-title" className="text-lg font-black">Fitness goal</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Choose what you are working toward.</p></div></div>
              <div className="space-y-2">{goals.map((goal) => <button key={goal.value} type="button" disabled={saving} aria-pressed={user?.goal === goal.value} onClick={() => { if (user?.goal !== goal.value) saveChanges({ goal: goal.value }); }} className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left transition disabled:opacity-60 ${user?.goal === goal.value ? 'border-amber-500 bg-amber-500/10' : 'hover:border-amber-500/40'}`} style={user?.goal === goal.value ? undefined : { borderColor: 'var(--color-border)' }}><span><span className="block text-sm font-bold">{goal.label}</span><span className="block text-xs" style={{ color: 'var(--color-text-secondary)' }}>{goal.detail}</span></span><span className={`h-4 w-4 shrink-0 rounded-full border-2 ${user?.goal === goal.value ? 'border-amber-500 bg-amber-500' : 'border-gray-500'}`} /></button>)}</div>
            </section>
          </div>

          <div className="space-y-8">
            <section aria-labelledby="profile-settings-title">
              <h2 id="profile-settings-title" className="mb-3 text-lg font-black">Settings</h2>
              <div className="overflow-hidden rounded-2xl border" style={panelStyle}>
                <SettingsItem first icon={LayoutList} label="Training split" value={splitName || 'Choose a split'} onClick={() => navigate('/splits')} />
                <SettingsItem icon={CalendarDays} label="Training preferences" value={`${user?.daysPerWeek || 'Set'} days/week · ${user?.experience?.toLowerCase() || 'set experience'}`} onClick={() => openEditor('training')} />
                <SettingsItem icon={Weight} label="Body weight" value={formatWeight(user)} onClick={() => openEditor('weight')} />
                <SettingsItem icon={Ruler} label="Height" value={formatHeight(user)} onClick={() => openEditor('height')} />
                <SettingsItem icon={Bell} label="Preferred workout time" value={user?.notificationTime || 'Not set'} onClick={() => openEditor('reminder')} />
                <button type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'} className="flex min-h-18 w-full items-center gap-3 border-t px-4 py-4 text-left transition hover:bg-amber-500/5 focus-visible:outline-2 focus-visible:outline-amber-500 sm:px-5" style={{ borderColor: 'var(--color-border)' }}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">Appearance</span><span className="mt-0.5 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span></span><span className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${theme === 'dark' ? 'bg-amber-500' : 'bg-gray-500'}`}><span className={`h-5 w-5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} /></span></button>
                <SettingsItem icon={Settings2} label="Units" value={`${user?.unitsWeight || 'KG'} · ${user?.unitsHeight || 'CM'}`} onClick={() => openEditor('units')} />
              </div>
            </section>

            <section className="rounded-2xl border p-5 sm:p-6" style={panelStyle}>
              <h2 className="text-lg font-black">Account</h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Finished for now? You can sign back in anytime.</p>
              <button type="button" onClick={logout} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 text-sm font-extrabold text-red-500 transition hover:bg-red-500/10"><LogOut size={18} aria-hidden="true" /> Log out</button>
            </section>
          </div>
        </div>
      </main>
      {activeEditor && <ProfileEditor key={activeEditor} type={activeEditor} user={user} saving={saving} error={saveError} onSave={saveChanges} onClose={() => setActiveEditor(null)} />}
    </div>
  );
}
