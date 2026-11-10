import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Dumbbell, HeartPulse, Sparkles, Utensils } from 'lucide-react';
import { askCoach } from '../../../services/apiClient';

const suggestions = [
  { icon: <Dumbbell size={19} className="mt-0.5 shrink-0 text-amber-500" />, text: 'How has my strength changed recently?' },
  { icon: <Utensils size={19} className="mt-0.5 shrink-0 text-amber-500" />, text: 'How has my diet looked this week?' },
  { icon: <HeartPulse size={19} className="mt-0.5 shrink-0 text-amber-500" />, text: 'What should I focus on for my goal?' },
];

function errorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Could not reach your coach. Please try again.';
}

export default function AiCoachScreen() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const send = async (text = draft) => {
    const question = text.trim();
    if (!question || loading || question.length > 1000) return;
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content: content.slice(0, 1500) }));
    setMessages((current) => [...current, { role: 'user', content: question }]);
    setDraft('');
    setError('');
    setLoading(true);
    try {
      const response = await askCoach(question, history);
      const answer = response.data?.data?.answer;
      if (!answer) throw new Error('The coach returned an empty answer.');
      setMessages((current) => [...current, { role: 'assistant', content: answer }]);
    } catch (requestError) {
      setMessages((current) => current.slice(0, -1));
      setDraft(question);
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    send();
  };

  return (
    <main className="min-h-[calc(100dvh-6rem)] px-4 pb-28 pt-6 sm:px-6 md:pb-8 md:pt-10" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <div className="mx-auto flex max-w-4xl flex-col">
        <header className="mb-6 flex items-start gap-4 sm:mb-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/20"><Sparkles size={23} strokeWidth={2.4} /></span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-amber-500">Wellfitness AI</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Your AI Coach</h1>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Ask about your training, meals, or goals. Answers can use your saved activity.</p>
          </div>
        </header>

        {messages.length === 0 && (
          <section className="rounded-3xl border p-5 sm:p-7" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }} aria-label="Suggested questions">
            <div className="flex items-center gap-2 text-sm font-bold"><Sparkles size={16} className="text-amber-500" /> Start with a question</div>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>I can check your current profile, logged meals, and completed workouts to give you a useful answer.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {suggestions.map(({ icon, text }) => (
                <button key={text} type="button" disabled={loading} onClick={() => send(text)} className="flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition hover:border-amber-500/60 hover:bg-amber-500/5 disabled:opacity-60" style={{ borderColor: 'var(--color-border)' }}>
                  {icon}{text}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-5" aria-label="Conversation" aria-live="polite">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-7 sm:max-w-[80%] sm:px-5 ${message.role === 'user' ? 'rounded-br-md bg-amber-500 text-black' : 'rounded-bl-md border'}`} style={message.role === 'assistant' ? { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' } : undefined}>
                {message.role === 'assistant' && <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-widest text-amber-500">AI Coach</span>}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div role="status" className="rounded-2xl border px-4 py-3 text-sm" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Checking your activity…</div></div>}
          <div ref={endRef} />
        </section>

        <div className="mt-6 md:mt-8">
          {error && <p role="alert" className="mb-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}
          <form onSubmit={onSubmit} className="flex items-end gap-2 rounded-2xl border p-2 shadow-sm focus-within:border-amber-500" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <label htmlFor="coach-question" className="sr-only">Ask your AI Coach</label>
            <textarea id="coach-question" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} maxLength={1000} rows={2} placeholder="Ask about your training or diet…" className="min-h-12 max-h-36 flex-1 resize-y bg-transparent px-3 py-2 text-base outline-none placeholder:opacity-50" disabled={loading} />
            <button type="submit" disabled={!draft.trim() || loading} aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"><ArrowUp size={20} strokeWidth={2.6} /></button>
          </form>
          <p className="mt-3 text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>Coach answers are guidance. For medical concerns, speak with a professional.</p>
        </div>
      </div>
    </main>
  );
}
