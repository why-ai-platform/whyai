import { motion } from 'motion/react';
import {
  BookOpen,
  Code2,
  Trophy,
  Map,
  Video,
  Users,
  Brain,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const features = [
  {
    id: 1,
    title: 'Comprehensive Course Content',
    description: 'Learn from text-based lessons, interactive visualizations, GIFs, and short video tutorials. Content is structured from basics to advanced topics for a smooth learning curve.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjIwNjE5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Text & Visual Learning', 'Video Tutorials', 'Interactive Diagrams', 'Step-by-Step Guides']
  },
  {
    id: 2,
    title: 'AI Learning Mindmap',
    description: 'Navigate your AI journey with a comprehensive mind map. Visualize the entire learning path, understand topic connections, and track progress from fundamentals to advanced topics.',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGJyYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNjE5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Visual Learning Path', 'Topic Interconnections', 'Progress Tracking', 'Skill Prerequisites']
  },
  {
    id: 3,
    title: 'Practice Platform',
    description: 'Sharpen your AI/ML skills with a problem-solving platform. Solve real-world AI challenges, implement algorithms, and practice on datasets — from beginner to advanced.',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1717501218534-156f33c28f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwbGVhcm5pbmclMjBkYXRhfGVufDF8fHx8MTc2MjA2MTk3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['AI/ML Challenges', 'Code Editor', 'Test Cases', 'Solutions & Discussions']
  },
  {
    id: 4,
    title: 'Competitions & Contests',
    description: 'Participate in AI competitions and coding contests. Compete with learners, build your portfolio, and get recognized for real achievements.',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNDA2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Weekly Contests', 'Leaderboards', 'Prizes & Recognition', 'Career Opportunities']
  }
];

const keyHighlights = [
  { icon: Brain, title: 'All AI Topics', description: 'ML, Deep Learning, Gen AI, Agentic AI' },
  { icon: Video, title: 'Multi-Format Learning', description: 'Text, Videos, Diagrams, Visualizations' },
  { icon: Users, title: 'Community Driven', description: 'Discussion Forums & Peer Support' },
  { icon: Sparkles, title: 'Beginner Friendly', description: 'Start from Zero, Master Everything' }
];

export function FeaturesSection() {
  return (
    <section style={{ background: 'var(--wa-surface)' }} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--wa-text)', margin: '0 0 10px' }}>
            Everything You Need to Learn AI
          </h2>
          <p style={{ fontSize: '0.975rem', color: 'var(--wa-text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            A complete learning system to take you from AI fundamentals to applied, hands-on work.
          </p>
        </motion.div>

        {/* Key highlights */}
        <div
          className="wa-card"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '56px' }}
        >
          {keyHighlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="flex items-start text-left"
              style={{
                gap: '12px',
                padding: '18px',
                borderLeft: index === 0 ? 'none' : '1px solid var(--wa-border)',
                borderTop: index > 1 ? '1px solid var(--wa-border)' : 'none',
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: '32px', height: '32px', borderRadius: 'var(--wa-radius-md)', background: 'var(--wa-accent-tint)', color: 'var(--wa-accent)' }}
              >
                <highlight.icon className="w-4 h-4" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--wa-text)' }}>{highlight.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>{highlight.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed features */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="wa-card flex flex-col md:flex-row"
              style={{ overflow: 'hidden' }}
            >
              <div style={{ flex: '0 0 auto', width: '100%', maxWidth: '320px' }}>
                <ImageWithFallback
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '180px', display: 'block' }}
                />
              </div>
              <div className="flex-1" style={{ padding: '24px' }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: '36px', height: '36px', borderRadius: 'var(--wa-radius-md)', background: 'var(--wa-accent-tint)', color: 'var(--wa-accent)', marginBottom: '14px' }}
                >
                  <feature.icon className="w-[18px] h-[18px]" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--wa-text)', margin: '0 0 8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--wa-text-secondary)', margin: '0 0 14px' }}>
                  {feature.description}
                </p>
                <ul className="flex flex-wrap" style={{ gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
                  {feature.features.map((item) => (
                    <li key={item} className="wa-pill">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
