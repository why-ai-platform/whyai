import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { MessageSquare, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { ROUTES } from '../../constants';

const newsItems = [
  {
    id: 1,
    title: 'OpenAI Releases GPT-4.5: New Breakthrough in AI Reasoning',
    description: 'The latest model shows unprecedented improvements in complex problem-solving and multi-step reasoning tasks.',
    category: 'Generative AI',
    date: 'Nov 1, 2025',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNDA2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    comments: 42,
    trending: true
  },
  {
    id: 2,
    title: 'Meta Introduces Multi-Modal AI Agents for Real-World Tasks',
    description: 'New agentic AI systems can understand and interact with both visual and textual information seamlessly.',
    category: 'Agentic AI',
    date: 'Oct 30, 2025',
    image: 'https://images.unsplash.com/photo-1756967385885-0f20d517f72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGFpJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjE5ODE0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    comments: 28,
    trending: true
  },
  {
    id: 3,
    title: 'Google DeepMind Achieves Quantum Supremacy in ML',
    description: 'Breakthrough quantum computing integration accelerates machine learning model training by 100x.',
    category: 'Machine Learning',
    date: 'Oct 28, 2025',
    image: 'https://images.unsplash.com/photo-1717501218534-156f33c28f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBuZXVyYWwlMjBuZXR3b3JrfGVufDF8fHx8MTc2MjA2MTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    comments: 35,
    trending: false
  },
  {
    id: 4,
    title: 'New Study: Transformer Models Learn Like Human Brains',
    description: 'Neuroscience research reveals striking similarities between neural networks and biological learning processes.',
    category: 'Deep Learning',
    date: 'Oct 25, 2025',
    image: 'https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGJyYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNjE5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    comments: 51,
    trending: false
  }
];

export function NewsSection() {
  const navigate = useNavigate();

  const handleNewsClick = (id: number) => {
    navigate(ROUTES.NEWS_DETAIL.replace(':id', id.toString()));
  };

  const handleViewAllClick = () => {
    navigate(ROUTES.NEWS);
  };

  return (
    <section style={{ background: 'var(--wa-surface)' }} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto" style={{ maxWidth: '1080px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
          style={{ marginBottom: '32px' }}
        >
          <div className="wa-pill" style={{ marginBottom: '12px' }}>
            <TrendingUp className="w-3.5 h-3.5" />
            What's Trending
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--wa-text)', margin: '0 0 10px' }}>
            Latest AI News & Updates
          </h2>
          <p style={{ fontSize: '0.975rem', color: 'var(--wa-text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            Stay updated with breakthroughs, research, and innovations in AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '20px' }}>
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card
                className="wa-card cursor-pointer"
                style={{ overflow: 'hidden', height: '100%' }}
                onClick={() => handleNewsClick(item.id)}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {item.trending && (
                    <span
                      className="wa-pill"
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--wa-surface)', border: '1px solid var(--wa-border)' }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
                <div style={{ padding: '18px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--wa-text-secondary)',
                        border: '1px solid var(--wa-border)',
                        borderRadius: 'var(--wa-radius-sm)',
                        padding: '0.15rem 0.5rem',
                      }}
                    >
                      {item.category}
                    </span>
                    <div className="flex items-center" style={{ gap: '4px', fontSize: '0.78rem', color: 'var(--wa-text-secondary)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--wa-text)', margin: '0 0 8px', lineHeight: 1.4 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)', lineHeight: 1.6, margin: '0 0 14px' }}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>
                    <span className="flex items-center" style={{ gap: '4px' }}>
                      <MessageSquare className="w-3.5 h-3.5" />
                      {item.comments} comments
                    </span>
                    <span className="flex items-center" style={{ gap: '4px', color: 'var(--wa-accent)', fontWeight: 600 }}>
                      Read more
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '32px' }}>
          <button className="wa-btn wa-btn-secondary" onClick={handleViewAllClick}>
            View All News
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
