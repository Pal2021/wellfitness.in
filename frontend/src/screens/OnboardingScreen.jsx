import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import { colors } from '../theme';
import api from '../services/api';

const GOALS = [
  { key: 'STRENGTH', emoji: '🏋️', label: 'Build Strength' },
  { key: 'MUSCLE', emoji: '💪', label: 'Build Muscle' },
  { key: 'WEIGHT_LOSS', emoji: '🔥', label: 'Lose Weight' },
  { key: 'ENDURANCE', emoji: '🏃', label: 'Endurance' },
  { key: 'GENERAL', emoji: '✨', label: 'Stay Fit' },
];

const EXPERIENCE = [
  { key: 'BEGINNER', label: 'Beginner', sub: '0–6 months' },
  { key: 'INTERMEDIATE', label: 'Intermediate', sub: '6–24 months' },
  { key: 'ADVANCED', label: 'Advanced', sub: '2+ years' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 4) {
      api.get('/split-templates').then(r => setTemplates(r.data.data || []));
      api.get(`/split-templates/recommended?days=${daysPerWeek}&experience=${experience}`)
         .then(r => setSelectedTemplate(r.data.data?.id));
    }
  }, [step, daysPerWeek, experience]);

  const complete = async () => {
    setLoading(true);
    try {
      await api.post('/onboarding/complete', {
        goal, experience, daysPerWeek, templateId: selectedTemplate,
      });
      updateUser({ onboardingComplete: true, goal, experience });
      navigate('/');
    } catch (e) {
      alert(e.response?.data?.message || 'Onboarding failed');
    } finally { setLoading(false); }
  };

  const dotStyle = (active) => ({
    width: active ? 16 : 6, height: 6, borderRadius: 20,
    background: active ? colors.AMBER : colors.BORDER_DEFAULT,
    transition: 'all 0.3s ease',
  });

  return (
    <div style={{ minHeight: '100vh', padding: 24, display: 'flex', flexDirection: 'column' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
        {[1,2,3,4].map(i => <div key={i} style={dotStyle(i <= step)} />)}
      </div>

      <div style={{ flex: 1, animation: 'fadeIn 0.4s ease' }}>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>What's your goal? 🎯</h2>
            <p style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 18 }}>We'll customize your experience</p>
            {GOALS.map(g => (
              <AppCard key={g.key} onClick={() => setGoal(g.key)}
                style={{ border: goal === g.key ? `1px solid ${colors.AMBER}` : undefined,
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{g.label}</span>
                {goal === g.key && <span style={{ marginLeft: 'auto', color: colors.AMBER }}>✓</span>}
              </AppCard>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Your experience? 📊</h2>
            <p style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 18 }}>Helps us pick the right split</p>
            {EXPERIENCE.map(e => (
              <AppCard key={e.key} onClick={() => setExperience(e.key)}
                style={{ border: experience === e.key ? `1px solid ${colors.AMBER}` : undefined,
                  padding: '14px 15px', cursor: 'pointer' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{e.label}</div>
                <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>{e.sub}</div>
                {experience === e.key && <span style={{ position: 'absolute', right: 15, color: colors.AMBER }}>✓</span>}
              </AppCard>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Days per week? 📅</h2>
            <p style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 18 }}>How many days can you train?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {[3,4,5,6].map(d => (
                <div key={d} onClick={() => setDaysPerWeek(d)} style={{
                  width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                  background: d === daysPerWeek ? colors.AMBER_DIM : colors.BG_SECONDARY,
                  border: d === daysPerWeek ? `1px solid ${colors.AMBER}` : `0.5px solid ${colors.BORDER_DEFAULT}`,
                  color: d === daysPerWeek ? colors.AMBER : colors.TEXT_SECONDARY,
                }}>{d}</div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Pick your split 🔄</h2>
            <p style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 18 }}>Based on your {daysPerWeek}-day schedule</p>
            {templates.map(t => (
              <AppCard key={t.id} onClick={() => setSelectedTemplate(t.id)}
                style={{ border: selectedTemplate === t.id ? `1px solid ${colors.AMBER}` : undefined,
                  padding: '14px 15px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{t.iconEmoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>{t.frequencyDays} days · {t.difficulty}</div>
                  </div>
                  {selectedTemplate === t.id && <span style={{ marginLeft: 'auto', color: colors.AMBER }}>✓</span>}
                </div>
              </AppCard>
            ))}
          </>
        )}
      </div>

      <div style={{ paddingTop: 16 }}>
        {step < 4 ? (
          <AppButton label="Continue"
            disabled={step === 1 ? !goal : step === 2 ? !experience : false}
            onClick={() => setStep(s => s + 1)} />
        ) : (
          <AppButton label="Start Training" loading={loading} disabled={!selectedTemplate} onClick={complete} />
        )}
        {step > 1 && (
          <div onClick={() => setStep(s => s - 1)} style={{
            textAlign: 'center', marginTop: 12, fontSize: 13, color: colors.TEXT_SECONDARY,
            fontWeight: 600, cursor: 'pointer'
          }}>Back</div>
        )}
      </div>
    </div>
  );
}
