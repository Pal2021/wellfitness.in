import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Dumbbell, HeartPulse, ChevronLeft, Sunrise, Sun, CloudRain, Sunset, Moon, Check, Loader2, AlertCircle } from 'lucide-react';
import { getTemplates, completeOnboarding } from '../../../services/apiClient';

// Core Flow Options
const GOAL_OPTIONS = [
  { id: 'LOSE_WEIGHT', title: 'Lose Weight', desc: 'Burn fat and get lean', icon: Flame },
  { id: 'BUILD_MUSCLE', title: 'Build Muscle', desc: 'Get stronger and bigger', icon: Dumbbell },
  { id: 'STAY_FIT', title: 'Stay Fit', desc: 'Maintain and feel great', icon: HeartPulse },
];

const EXP_OPTIONS = [
  { id: 'BEGINNER', title: 'Beginner', desc: 'Less than 1 year training' },
  { id: 'INTERMEDIATE', title: 'Intermediate', desc: '1 to 3 years training' },
  { id: 'ADVANCED', title: 'Advanced', desc: '3 plus years training' },
];

const FREQ_LABELS = {
  2: 'Perfect for beginners',
  3: 'The most popular choice',
  4: 'Great for steady progress',
  5: 'Serious commitment',
  6: 'Elite level dedication',
};

const TIME_BLOCKS = [
  { id: 'EARLY', title: 'Early Bird', desc: '5 AM to 8 AM', icon: Sunrise, defaultTime: '06:00' },
  { id: 'MORNING', title: 'Morning', desc: '8 AM to 12 PM', icon: Sun, defaultTime: '09:00' },
  { id: 'AFTERNOON', title: 'Afternoon', desc: '12 PM to 5 PM', icon: CloudRain, defaultTime: '13:00' },
  { id: 'EVENING', title: 'Evening', desc: '5 PM to 9 PM', icon: Sunset, defaultTime: '18:00' },
  { id: 'NIGHT', title: 'Night Owl', desc: '9 PM onwards', icon: Moon, defaultTime: '21:00' },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form payload
  const [formData, setFormData] = useState({
    goal: '',
    experience: '',
    daysPerWeek: null,
    templateId: '',
    notificationTime: '',
  });

  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateError, setTemplateError] = useState(false);

  useEffect(() => {
    if (step === 3 && templates.length === 0 && !templateError) {
      fetchTemplates();
    }
  }, [step]);

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    setTemplateError(false);
    try {
      const res = await getTemplates();
      const data = res.data?.data || res.data;
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setTemplateError(true);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setDirection('right');
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('left');
      setStep((s) => s - 1);
    }
  };

  const submitOnboarding = async () => {
    setIsSubmitLoading(true);
    setSubmitError('');
    try {
      await completeOnboarding({
        goal: formData.goal,
        experience: formData.experience,
        daysPerWeek: formData.daysPerWeek,
        templateId: formData.templateId,
        notificationTime: formData.notificationTime || '09:00',
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to save your plan. Please try again.');
      setIsSubmitLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.goal !== '';
    if (step === 2) return formData.experience !== '';
    if (step === 3) return formData.daysPerWeek !== null;
    if (step === 4) return formData.templateId !== '';
    if (step === 5) return true;
    return false;
  };

  useEffect(() => {
    if (step === 6) {
      setTimeout(() => {
        submitOnboarding();
      }, 1500);
    }
  }, [step]);

  const getTransClass = () => {
    return `absolute inset-0 flex flex-col pt-8 pb-32 animate-in duration-300 slide-in-from-${
      direction === 'right' ? 'right' : 'left'
    }-8 fade-in-0`;
  };

  const progressPct = ((step - 1) / 5) * 100;

  return (
    <div style={S.page} data-page="onboarding">
      
      {/* ── Progress Bar ── */}
      {step < 6 && (
        <div style={S.progressBarContainer}>
          <div
            style={{ ...S.progressBarFill, width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* ── Top Nav ── */}
      {step > 1 && step < 6 && (
        <button
          onClick={handleBack}
          style={S.backButton}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
      )}

      {/* ── Scrollable Content Area ── */}
      <div style={S.container} data-container="onboarding">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className={getTransClass()}>
            <h1 style={S.title}>What's your goal?</h1>
            <p style={S.subtitle}>We'll build your plan around this</p>

            <div style={S.listGroup}>
              {GOAL_OPTIONS.map((opt) => {
                const isSel = formData.goal === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, goal: opt.id })}
                    style={{ ...S.optionCard, ...(isSel ? S.optionCardSelected : {}) }}
                  >
                    <Icon
                      size={28}
                      color={isSel ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                      style={{ marginBottom: '16px' }}
                    />
                    <h3 style={{ ...S.cardTitle, ...(isSel ? S.cardTitleSelected : {}) }}>{opt.title}</h3>
                    <p style={isSel ? S.cardDescSelected : S.cardDesc}>{opt.desc}</p>
                    
                    {isSel && (
                      <div style={S.checkmarkPos}>
                        <Check size={20} strokeWidth={3} color="var(--color-primary)" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={getTransClass()}>
            <h1 style={S.title}>Your experience level?</h1>
            <p style={S.subtitle}>Be honest — we'll match your intensity</p>

            <div style={S.listGroup}>
              {EXP_OPTIONS.map((opt) => {
                const isSel = formData.experience === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, experience: opt.id })}
                    style={{ ...S.optionCard, ...(isSel ? S.optionCardSelected : {}) }}
                  >
                    <h3 style={{ ...S.cardTitle, ...(isSel ? S.cardTitleSelected : {}) }}>{opt.title}</h3>
                    <p style={isSel ? S.cardDescSelected : S.cardDesc}>{opt.desc}</p>
                    {isSel && (
                      <div style={S.checkmarkPos}>
                        <Check size={20} strokeWidth={3} color="var(--color-primary)" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={getTransClass()}>
            <h1 style={S.title}>How many days can you train?</h1>
            <p style={S.subtitle}>Pick what's realistic for your schedule</p>

            <div style={S.daysContainer}>
              {[2, 3, 4, 5, 6].map((num) => {
                const isSel = formData.daysPerWeek === num;
                return (
                  <button
                    key={num}
                    onClick={() => setFormData({ ...formData, daysPerWeek: num })}
                    style={{ ...S.bubbleButton, ...(isSel ? S.bubbleButtonSelected : {}) }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', height: '32px' }}>
              {formData.daysPerWeek && (
                <p style={S.daysLabel} className="animate-fade-in-up">
                  {FREQ_LABELS[formData.daysPerWeek]}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className={getTransClass()}>
            <h1 style={S.title}>Choose your split</h1>
            <p style={S.subtitle}>Based on your goal and schedule ({formData.daysPerWeek} days)</p>

            {templateError ? (
              <div style={S.errorBanner}>
                <AlertCircle color="var(--color-error)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-error)', fontWeight: 'var(--font-medium)', marginBottom: '16px' }}>
                  Couldn't load suggestions.
                </p>
                <button onClick={fetchTemplates} style={S.retryBtn}>
                  Retry
                </button>
              </div>
            ) : isLoadingTemplates ? (
              <div style={S.listGroup}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={S.skeletonLoader} className="animate-pulse" />
                ))}
              </div>
            ) : (
              <div style={S.listGroup}>
                {templates.map((tpl) => {
                  const isSel = formData.templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setFormData({ ...formData, templateId: tpl.id })}
                      style={{ ...S.optionCard, ...(isSel ? S.optionCardSelected : {}) }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ ...S.cardTitle, ...(isSel ? S.cardTitleSelected : {}) }}>{tpl.name}</h3>
                        <span style={S.badge}>
                          {tpl.daysPerWeek} Days
                        </span>
                      </div>
                      <p style={isSel ? S.cardDescSelected : S.cardDesc}>
                        {tpl.description || 'Complete muscle development protocol'}
                      </p>
                      
                      {isSel && (
                        <div style={S.checkmarkPosCenter}>
                          <Check size={20} strokeWidth={3} color="var(--color-primary)" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className={getTransClass()}>
            <h1 style={S.title}>When do you train?</h1>
            <p style={S.subtitle}>We'll remind you at this time every day</p>

            <div style={S.listGroup}>
              {TIME_BLOCKS.map((opt) => {
                const isSel = formData.notificationTime === opt.defaultTime || (!formData.notificationTime && opt.id === 'MORNING');
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, notificationTime: opt.defaultTime })}
                    style={{ ...S.timeBlockRow, ...(isSel ? S.optionCardSelected : {}) }}
                  >
                    <div style={{
                      ...S.timeBlockIconWrap,
                      background: isSel ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                      color: isSel ? 'var(--color-text-inverse)' : 'var(--color-text-muted)'
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <h3 style={{ ...S.cardTitle, ...(isSel ? S.cardTitleSelected : {}), fontSize: 'var(--text-base)' }}>{opt.title}</h3>
                      <p style={{ ...S.cardDesc, marginTop: '2px', ...(isSel ? S.cardDescSelected : {}) }}>{opt.desc}</p>
                    </div>
                    {isSel && <Check size={18} color="var(--color-primary)" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            <div style={S.timeInputWrapper}>
              <label style={S.timeInputLabel}>Or pick an exact time</label>
              <input
                type="time"
                value={formData.notificationTime || '09:00'}
                onChange={(e) => setFormData({ ...formData, notificationTime: e.target.value })}
                style={S.timeInput}
              />
            </div>
          </div>
        )}

        {/* STEP 6 (FINAL) */}
        {step === 6 && (
          <div style={S.finalWrapper} className="animate-in fade-in-0 duration-1000">
            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <div style={S.finalIconOuter} className="animate-ping" />
              <div style={S.finalIconInner}>
                {isSubmitLoading ? (
                  <Loader2 className="animate-spin" color="var(--color-text-inverse)" size={32} />
                ) : (
                  <Check color="var(--color-text-inverse)" size={40} strokeWidth={3} />
                )}
              </div>
            </div>

            <h1 style={{ ...S.title, marginBottom: '12px' }}>You're all set!</h1>
            <p style={{ ...S.subtitle, maxWidth: '280px', margin: '0 auto 40px' }}>
              Your personalized fitness plan is ready. Let's get to work.
            </p>

            {submitError && (
              <div style={S.errorBanner} className="animate-shake">
                {submitError}
              </div>
            )}
            
            <div style={S.tagsWrapper}>
              <span style={S.badgeOutline}>{formData.goal.replace('_', ' ')}</span>
              <span style={S.badgeOutline}>{formData.experience}</span>
              <span style={S.badgeOutline}>{formData.daysPerWeek} DAYS</span>
            </div>
            
            {submitError && !isSubmitLoading && (
              <button onClick={submitOnboarding} style={S.actionBtn}>
                Retry Setup
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Actions ── */}
      {step < 6 && (
        <div style={S.bottomBar} data-bottom-bar>
          <div style={{ width: '100%', maxWidth: '430px', margin: '0 auto' }}>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              style={{
                ...S.actionBtn,
                ...( !canProceed() ? S.actionBtnDisabled : {} ),
              }}
            >
              {step === 5 ? 'Create Plan' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MATCHING THEME STYLES
   ══════════════════════════════════════════════ */
const S = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)',
    overflow: 'hidden',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'var(--color-bg-tertiary)',
    zIndex: 50,
  },
  progressBarFill: {
    height: '100%',
    background: 'var(--color-primary)',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 500ms ease-out',
  },
  backButton: {
    position: 'absolute',
    top: '32px',
    left: '24px',
    zIndex: 40,
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '8px',
    transition: 'color 200ms ease',
  },
  container: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    maxWidth: '430px',
    margin: '0 auto',
    paddingTop: '96px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '160px',
    overflowY: 'auto',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 8vw, 2.5rem)',
    fontWeight: 'var(--font-extrabold)',
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-muted)',
    marginBottom: '40px',
  },
  listGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  optionCard: {
    position: 'relative',
    width: '100%',
    padding: '24px',
    paddingRight: '48px',
    borderRadius: 'var(--radius-2xl)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    textAlign: 'left',
    transition: 'all 200ms ease',
    cursor: 'pointer',
  },
  optionCardSelected: {
    background: 'var(--color-bg-elevated)', // typically subtly lighter to match active states
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 0 1px var(--color-primary)',
  },
  cardTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  },
  cardTitleSelected: {
    color: 'var(--color-primary)',
  },
  cardDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  cardDescSelected: {
    color: 'var(--color-text-primary)',
    opacity: 0.8,
  },
  checkmarkPos: {
    position: 'absolute',
    top: '24px',
    right: '24px',
  },
  checkmarkPosCenter: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '20px',
  },
  daysContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '40px',
  },
  bubbleButton: {
    position: 'relative',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 300ms ease',
  },
  bubbleButtonSelected: {
    background: 'var(--gradient-button)',
    color: 'var(--color-text-inverse)',
    borderColor: 'transparent',
    boxShadow: 'var(--shadow-glow)',
  },
  daysLabel: {
    color: 'var(--color-primary)',
    fontWeight: 'var(--font-medium)',
    fontSize: 'var(--text-lg)',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'var(--color-bg-tertiary)',
    fontSize: '10px',
    fontWeight: 'var(--font-bold)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-secondary)',
  },
  timeBlockRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    padding: '16px',
    borderRadius: 'var(--radius-xl)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    transition: 'all 200ms ease',
    cursor: 'pointer',
  },
  timeBlockIconWrap: {
    padding: '12px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 200ms ease',
  },
  timeInputWrapper: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid var(--color-border)',
  },
  timeInputLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '16px',
  },
  timeInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: 'var(--font-extrabold)',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
  },
  errorBanner: {
    padding: '24px',
    borderRadius: 'var(--radius-2xl)',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    textAlign: 'center',
  },
  retryBtn: {
    padding: '8px 24px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: 'var(--color-error)',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'var(--font-bold)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '12px',
    border: 'none',
    cursor: 'pointer',
  },
  skeletonLoader: {
    height: '104px',
    borderRadius: 'var(--radius-2xl)',
    background: 'var(--color-bg-tertiary)',
  },
  finalWrapper: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    zIndex: 50,
  },
  finalIconOuter: {
    position: 'absolute',
    inset: '-10px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    opacity: 0.1,
  },
  finalIconInner: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--gradient-button)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
  },
  tagsWrapper: {
    width: '100%',
    maxWidth: '320px',
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '48px',
  },
  badgeOutline: {
    padding: '6px 12px',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontWeight: 'var(--font-semibold)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-secondary)',
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px',
    backgroundImage: 'linear-gradient(to top, var(--color-bg-primary) 50%, transparent 100%)',
    zIndex: 50,
  },
  actionBtn: {
    width: '100%',
    padding: '20px',
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-bold)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-inverse)',
    background: 'var(--gradient-button)',
    border: 'none',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 300ms ease',
    cursor: 'pointer',
    transform: 'translateY(0)',
    opacity: 1,
  },
  actionBtnDisabled: {
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    boxShadow: 'none',
    cursor: 'not-allowed',
    transform: 'translateY(4px)',
    opacity: 0.7,
  },
};
