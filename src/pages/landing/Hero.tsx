import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LogIn, Route, Terminal, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { LoginDialog } from './LoginDialog';

const highlights = [
  { icon: Route, title: 'Guided Roadmaps', desc: 'Step-by-step learning paths' },
  { icon: Terminal, title: 'Interactive Playground', desc: 'Run code with one click' },
  { icon: Trophy, title: 'Contests & Practice', desc: 'Sharpen skills with problems' },
];

export function Hero() {
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  return (
    <section style={{ background: 'var(--wa-bg)', borderBottom: '1px solid var(--wa-border)' }}>
      <div className="mx-auto px-4" style={{ maxWidth: '880px', paddingTop: '64px', paddingBottom: '56px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1
            style={{
              fontFamily: 'var(--wa-font-sans)',
              fontSize: '2.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--wa-text)',
              textWrap: 'balance' as any,
              margin: '0 0 16px',
            }}
          >
            Learn AI. Understand the Concepts. Build Real Systems.
          </h1>

          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--wa-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 32px',
            }}
          >
            Explore Artificial Intelligence through structured lessons, practical coding examples,
            and hands-on projects — from foundational concepts to Agentic AI.
          </p>

          <div className="flex flex-row items-center justify-center" style={{ gap: '12px', marginBottom: '48px' }}>
            <button className="wa-btn wa-btn-primary" style={{ height: '40px', padding: '0 20px' }} onClick={() => navigate(ROUTES.COURSES)}>
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="wa-btn wa-btn-secondary"
              style={{ height: '40px', padding: '0 20px' }}
              onClick={() => setIsLoginDialogOpen(true)}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>

          <div
            className="wa-card"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
          >
            {highlights.map((h, i) => (
              <div
                key={h.title}
                className="flex items-start text-left"
                style={{
                  gap: '12px',
                  padding: '18px',
                  borderLeft: i === 0 ? 'none' : '1px solid var(--wa-border)',
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--wa-radius-md)',
                    background: 'var(--wa-accent-tint)',
                    color: 'var(--wa-accent)',
                  }}
                >
                  <h.icon className="w-4 h-4" />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--wa-text)' }}>{h.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </section>
  );
}
