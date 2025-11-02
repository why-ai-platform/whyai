import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MessageSquare, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

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
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400">What's Trending</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Latest AI News & Updates
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest breakthroughs, research, and innovations in the AI world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="relative overflow-hidden h-48">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.trending && (
                    <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.date}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {item.comments} Comments
                    </Button>
                    <Button variant="link" size="sm">
                      Read More
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="border-2">
            View All News
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
