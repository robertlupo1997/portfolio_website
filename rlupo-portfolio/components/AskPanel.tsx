import React, { useEffect, useRef, useState } from 'react';
import { askQuestion } from '../lib/ask/client';
import type { Citation } from '../lib/ask/types';

const STARTERS = [
  'What has Trey shipped in production?',
  'Show me his machine learning work',
  'What does he build with Claude and the Anthropic SDK?',
  'What is his background in finance and FP&A?',
  'What has he built in Rust?',
];

interface AskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSlide: (index: number) => void;
  initialQuery?: string;
}

const AskPanel: React.FC<AskPanelProps> = ({ isOpen, onClose, onGoToSlide, initialQuery }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [status, setStatus] = useState<'idle' | 'searching' | 'streaming' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const generationRef = useRef(0);
  const busy = status === 'searching' || status === 'streaming';

  useEffect(() => {
    if (isOpen) {
      // Fix 2: reset to fresh idle state on every open; prefill if caller provided a query
      setQuestion(initialQuery ?? '');
      setAnswer('');
      setCitations([]);
      setError('');
      setStatus('idle');
      inputRef.current?.focus();
    } else {
      // Fix 1: cancel any in-flight stream so stale callbacks are silently dropped
      generationRef.current++;
      setStatus('idle');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      // Suppress carousel arrow-key navigation while the panel is open.
      // Capture phase ensures this fires before the carousel's bubble-phase listener.
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.stopImmediatePropagation();
        return;
      }
      // Focus trap: cycle Tab inside the dialog
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, input, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [isOpen, onClose]);

  const submit = (q: string) => {
    if (!q.trim() || busy) return;
    setQuestion(q);
    setAnswer('');
    setCitations([]);
    setError('');
    setStatus('searching');
    // Fix 1: capture generation so callbacks from a closed/reopened panel are discarded
    const gen = ++generationRef.current;
    void askQuestion(q, (e) => {
      if (gen !== generationRef.current) return;
      if (e.type === 'searching') setStatus('searching');
      if (e.type === 'text') { setStatus('streaming'); setAnswer((a) => a + e.text); }
      if (e.type === 'citations') setCitations(e.citations);
      if (e.type === 'done') setStatus('done');
      if (e.type === 'error') { setStatus('error'); setError(e.message); }
    });
  };

  const citationClick = (c: Citation) => {
    if (typeof c.slideIndex === 'number') { onClose(); onGoToSlide(c.slideIndex); }
    else if (c.url) window.open(c.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={panelRef}
      className={`ask-panel ${isOpen ? 'ask-panel--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ask about Trey's work"
      data-testid="ask-panel"
    >
      <div className="ask-panel__inner">
        <div className="ask-panel__bar">
          <span className="ask-panel__title">ASK MY WORK</span>
          <button className="ask-panel__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="ask-panel__form" onSubmit={(e) => { e.preventDefault(); submit(question); }}>
          <input
            ref={inputRef} className="ask-panel__input" value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about Trey's work…" maxLength={500} disabled={busy}
          />
        </form>
        {status === 'idle' && (
          <ul className="ask-panel__starters">
            {STARTERS.map((s) => (
              <li key={s}><button className="ask-panel__starter" onClick={() => submit(s)}>{s}</button></li>
            ))}
          </ul>
        )}
        {status === 'searching' && <p className="ask-panel__status">searching portfolio…</p>}
        {answer && <p className="ask-panel__answer" data-testid="ask-answer">{answer}</p>}
        {status === 'error' && <p className="ask-panel__error">{error}</p>}
        {citations.length > 0 && (
          <ol className="ask-panel__citations">
            {citations.map((c) => (
              <li key={c.id}>
                <button className="ask-panel__citation" onClick={() => citationClick(c)} data-testid={`citation-${c.n}`}>
                  [{c.n}] {c.title}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AskPanel;
