import { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  LayoutDashboard, 
  Brain, 
  Network, 
  Eye, 
  Sparkles, 
  Bot,
  Target,
  Layers,
  ChevronRight,
  Clock,
  BarChart,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '../../constants';

interface Course {
  id: string;
  title: string;
  icon: any;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  progress: number;
  description: string;
  topics: string[];
  locked?: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to AI',
    icon: Brain,
    level: 'Beginner',
    duration: '4 weeks',
    lessons: 24,
    progress: 0,
    description: 'Start your AI journey with fundamental concepts, history, and applications of artificial intelligence.',
    topics: ['AI Basics', 'Problem Solving', 'Search Algorithms', 'Knowledge Representation'],
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    icon: Target,
    level: 'Beginner',
    duration: '6 weeks',
    lessons: 32,
    progress: 0,
    description: 'Learn supervised and unsupervised learning, regression, classification, and model evaluation.',
    topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
  },
  {
    id: '3',
    title: 'Deep Learning',
    icon: Layers,
    level: 'Intermediate',
    duration: '8 weeks',
    lessons: 40,
    progress: 0,
    description: 'Master neural networks, CNNs, RNNs, and modern deep learning architectures.',
    topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning', 'Optimization'],
  },
  {
    id: '4',
    title: 'Natural Language Processing',
    icon: BookOpen,
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 28,
    progress: 0,
    description: 'Understand text processing, transformers, and language models like BERT and GPT.',
    topics: ['Text Processing', 'Transformers', 'BERT', 'GPT', 'Sentiment Analysis'],
  },
  {
    id: '5',
    title: 'Computer Vision',
    icon: Eye,
    level: 'Intermediate',
    duration: '7 weeks',
    lessons: 35,
    progress: 0,
    description: 'Learn image processing, object detection, segmentation, and modern vision models.',
    topics: ['Image Processing', 'Object Detection', 'Segmentation', 'YOLO', 'Vision Transformers'],
  },
  {
    id: '6',
    title: 'Generative AI',
    icon: Sparkles,
    level: 'Advanced',
    duration: '6 weeks',
    lessons: 30,
    progress: 0,
    description: 'Explore GANs, VAEs, diffusion models, and create AI-generated content.',
    topics: ['GANs', 'VAEs', 'Diffusion Models', 'Stable Diffusion', 'Image Generation'],
  },
  {
    id: '7',
    title: 'Agentic AI',
    icon: Bot,
    level: 'Advanced',
    duration: '5 weeks',
    lessons: 25,
    progress: 0,
    description: 'Build autonomous AI agents that can plan, reason, and take actions.',
    topics: ['Agent Architecture', 'Planning', 'Tool Use', 'Multi-Agent Systems', 'LangChain'],
  },
  {
    id: '8',
    title: 'Reinforcement Learning',
    icon: Network,
    level: 'Advanced',
    duration: '8 weeks',
    lessons: 36,
    progress: 0,
    description: 'Master reward-based learning, Q-learning, policy gradients, and deep RL.',
    topics: ['Q-Learning', 'Policy Gradients', 'DQN', 'PPO', 'Multi-Agent RL'],
  },
];

type TabType = 'courses' | 'playground' | 'dashboard';

export function CoursesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'courses' as TabType, label: 'All Courses', icon: BookOpen },
    { id: 'playground' as TabType, label: 'Playground', icon: Code },
    ...(isAuthenticated ? [{ id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const renderCoursesContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explore AI Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Master AI, ML, Deep Learning, and cutting-edge technologies from basics to advanced
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => {
          const Icon = course.icon;
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 dark:hover:border-blue-600 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  {course.locked && <Lock className="w-5 h-5 text-gray-400" />}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {course.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.topics.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  {course.progress > 0 ? 'Continue' : 'Start Course'}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderPlaygroundContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI/ML Playground
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Practice coding with GPU-powered environment for ML/AI problems
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Interactive Coding Platform
          </h3>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            GPU Enabled
          </Badge>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Python 3.10 | TensorFlow 2.x | PyTorch 2.x</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">Reset</Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                Run Code
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
            <pre>{`# Import libraries
import numpy as np
import tensorflow as tf
from sklearn.datasets import load_iris

# Load dataset
X, y = load_iris(return_X_y=True)

# Build and train your model here
# GPU acceleration available for heavy computations

print("Ready to code!")`}</pre>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Practice Problems</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              1000+
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From basic to advanced
            </p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Contest Ready</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              LeetCode Style
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test cases & submissions
            </p>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">GPU Access</h4>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Free Tier
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Run ML models efficiently
            </p>
          </Card>
        </div>

        <Button 
          onClick={() => navigate(ROUTES.PRACTICE)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Go to Practice Platform
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </Card>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Learning Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Courses Enrolled</h3>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            3
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Problems Solved</h3>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            47
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Learning Streak</h3>
            <BarChart className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            12 days
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h3>
        <div className="space-y-4">
          {courses.slice(0, 3).map((course) => {
            const Icon = course.icon;
            return (
              <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <Progress value={Math.random() * 100} className="h-2 flex-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Continue
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Button 
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        View Full Dashboard
        <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-4 sticky top-20">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Navigation</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'courses' && renderCoursesContent()}
              {activeTab === 'playground' && renderPlaygroundContent()}
              {activeTab === 'dashboard' && renderDashboardContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
