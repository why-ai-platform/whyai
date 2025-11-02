import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
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
    description: 'Learn from text-based lessons, interactive visualizations, GIFs, and short video tutorials. Our content is structured from basics to advanced topics, ensuring a smooth learning curve for everyone.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjIwNjE5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Text & Visual Learning', 'Video Tutorials', 'Interactive GIFs', 'Step-by-Step Guides']
  },
  {
    id: 2,
    title: 'AI Learning Mindmap',
    description: 'Navigate your AI journey with our comprehensive mind map. Visualize the entire learning path, understand topic connections, and track your progress from fundamentals to cutting-edge technologies.',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGJyYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNjE5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Visual Learning Path', 'Topic Interconnections', 'Progress Tracking', 'Skill Prerequisites']
  },
  {
    id: 3,
    title: 'Practice Platform',
    description: 'Sharpen your AI/ML skills with our LeetCode-style problem platform. Solve real-world AI challenges, implement algorithms, and practice on datasets. From beginner to expert-level problems.',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1717501218534-156f33c28f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwbGVhcm5pbmclMjBkYXRhfGVufDF8fHx8MTc2MjA2MTk3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['AI/ML Challenges', 'Code Editor', 'Test Cases', 'Solutions & Discussions']
  },
  {
    id: 4,
    title: 'Competitions & Contests',
    description: 'Participate in regular AI competitions and coding contests. Compete with learners worldwide, win prizes, and get noticed by top companies. Build your portfolio with real achievements.',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwNDA2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: ['Weekly Contests', 'Leaderboards', 'Prizes & Recognition', 'Career Opportunities']
  }
];

const keyHighlights = [
  {
    icon: Brain,
    title: 'All AI Topics',
    description: 'ML, Deep Learning, Gen AI, Agentic AI'
  },
  {
    icon: Video,
    title: 'Multi-Format Learning',
    description: 'Text, Videos, GIFs, Visualizations'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Discussion Forums & Peer Support'
  },
  {
    icon: Sparkles,
    title: 'Beginner Friendly',
    description: 'Start from Zero, Master Everything'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Master AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A complete learning ecosystem designed to take you from AI novice to expert. 
            Learn, practice, compete, and grow with our comprehensive platform.
          </p>
        </motion.div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {keyHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                  <highlight.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {highlight.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Image Side */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 w-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
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
