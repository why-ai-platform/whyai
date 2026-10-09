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
import { BreadcrumbNav } from '../../components/common/BreadcrumbNav';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ROUTES } from '../../constants';
import { useIsMobile } from '../../components/ui/use-mobile';
import '../../pages/courses/viewer/courseViewer.css';

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
    duration: '3 weeks',
    lessons: 12,
    progress: 0,
    description: 'Build autonomous AI agents that can plan, reason, and take actions — from core concepts to shipping your first working agent.',
    topics: ['Agent Architecture', 'Planning & Reasoning', 'Tool Use', 'Memory', 'Multi-Agent Systems', 'Build Your First Agent'],
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
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Check if playground tab should be activated from breadcrumb navigation
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab === 'playground') {
      sessionStorage.removeItem('activeTab'); // Clear after reading
      return 'playground';
    }
    return 'courses';
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const tabs = [
    { id: 'courses' as TabType, label: 'All Courses', icon: BookOpen },
    { id: 'playground' as TabType, label: 'Playground', icon: Code },
    ...(isAuthenticated ? [{ id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  const getLevelColor = (level: string) => {
    // Semantic, not decorative — one restrained color per difficulty, same
    // treatment in both themes via the shared --wa- tokens.
    switch (level) {
      case 'Beginner':
        return { background: 'var(--wa-success-tint)', color: 'var(--wa-success)' };
      case 'Intermediate':
        return { background: 'var(--wa-accent-tint)', color: 'var(--wa-accent)' };
      case 'Advanced':
        return { background: 'var(--wa-warning-tint)', color: 'var(--wa-warning)' };
      default:
        return { background: 'var(--wa-bg)', color: 'var(--wa-text-secondary)' };
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
              <Card className="wa-card p-6" style={{ transition: 'border-color 0.15s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--wa-radius-md)', background: 'var(--wa-accent-tint)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--wa-accent)' }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--wa-text)' }}>
                        {course.title}
                      </h3>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '0.1rem 0.5rem',
                          borderRadius: 'var(--wa-radius-sm)',
                          marginTop: '0.25rem',
                          ...getLevelColor(course.level),
                        }}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>
                  {course.locked && <Lock className="w-4 h-4" style={{ color: 'var(--wa-text-secondary)' }} />}
                </div>

                <p style={{ color: 'var(--wa-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }} className="line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 mb-4" style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>Progress</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--wa-accent)' }}>
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="wa-pill" style={{ fontSize: '0.7rem' }}>
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="wa-pill" style={{ fontSize: '0.7rem' }}>
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(ROUTES.COURSE_VIEWER.replace(':id', course.id))}
                  disabled={course.locked}
                  className={`wa-btn ${course.locked ? 'wa-btn-secondary' : 'wa-btn-primary'}`}
                  style={{ width: '100%', opacity: course.locked ? 0.6 : 1, cursor: course.locked ? 'not-allowed' : 'pointer' }}
                >
                  {course.locked ? 'Coming Soon' : course.progress > 0 ? 'Continue' : 'Start Course'}
                  <ChevronRight className="w-4 h-4" />
                </button>
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
          <span className="wa-pill" style={{ background: 'var(--wa-success-tint)', color: 'var(--wa-success)' }}>
            GPU Enabled
          </span>
        </div>

        <div className="rounded-lg p-6 mb-6" style={{ background: 'var(--wa-bg)', border: '1px solid var(--wa-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)' }}>Python 3.10 | TensorFlow 2.x | PyTorch 2.x</span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">Reset</Button>
              <button className="wa-btn wa-btn-primary">
                Run Code
              </button>
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ background: 'var(--wa-code-bg)', fontFamily: 'var(--wa-font-mono)', fontSize: '0.85rem', color: 'var(--wa-success)' }}>
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
          <Card className="p-4 wa-card">
            <h4 style={{ fontWeight: 600, color: 'var(--wa-text)', marginBottom: '0.5rem' }}>Practice Problems</h4>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wa-accent)', marginBottom: '0.5rem' }}>
              1000+
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)' }}>
              From basic to advanced
            </p>
          </Card>

          <Card className="p-4 wa-card">
            <h4 style={{ fontWeight: 600, color: 'var(--wa-text)', marginBottom: '0.5rem' }}>Contest Ready</h4>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wa-accent)', marginBottom: '0.5rem' }}>
              LeetCode Style
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)' }}>
              Test cases & submissions
            </p>
          </Card>

          <Card className="p-4 wa-card">
            <h4 style={{ fontWeight: 600, color: 'var(--wa-text)', marginBottom: '0.5rem' }}>GPU Access</h4>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wa-accent)', marginBottom: '0.5rem' }}>
              Free Tier
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)' }}>
              Run ML models efficiently
            </p>
          </Card>
        </div>

        <button
          onClick={() => navigate(ROUTES.PRACTICE, { state: { fromPlayground: true } })}
          className="wa-btn wa-btn-primary"
          style={{ width: '100%' }}
        >
          Go to Practice Platform
          <ChevronRight className="w-4 h-4" />
        </button>
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
        <Card className="p-6 wa-card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: 600, color: 'var(--wa-text)' }}>Courses Enrolled</h3>
            <BookOpen className="w-4 h-4" style={{ color: 'var(--wa-accent)' }} />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--wa-text)' }}>3</p>
        </Card>

        <Card className="p-6 wa-card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: 600, color: 'var(--wa-text)' }}>Problems Solved</h3>
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--wa-success)' }} />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--wa-text)' }}>47</p>
        </Card>

        <Card className="p-6 wa-card">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: 600, color: 'var(--wa-text)' }}>Learning Streak</h3>
            <BarChart className="w-4 h-4" style={{ color: 'var(--wa-warning)' }} />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--wa-text)' }}>12 days</p>
        </Card>
      </div>

      <Card className="p-6 wa-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--wa-text)', marginBottom: '1rem' }}>Continue Learning</h3>
        <div className="space-y-4">
          {courses.slice(0, 3).map((course) => {
            const Icon = course.icon;
            return (
              <div key={course.id} className="flex items-center space-x-4 p-4 rounded-lg" style={{ background: 'var(--wa-bg)' }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: 'var(--wa-radius-md)', background: 'var(--wa-accent-tint)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--wa-accent)' }} />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontWeight: 600, color: 'var(--wa-text)' }}>{course.title}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <Progress value={Math.random() * 100} className="h-2 flex-1" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--wa-text-secondary)' }}>
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                </div>
                <button className="wa-btn wa-btn-secondary">Continue</button>
              </div>
            );
          })}
        </div>
      </Card>

      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="wa-btn wa-btn-primary"
        style={{ width: '100%' }}
      >
        View Full Dashboard
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const breadcrumbItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Courses', path: ROUTES.COURSES },
    ...(activeTab !== 'courses' ? [{ label: activeTab === 'playground' ? 'Playground' : 'Dashboard', path: ROUTES.COURSES }] : []),
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--wa-bg)' }}>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Sidebar */}
          <div className="flex-shrink-0" style={{ width: isMobile ? '100%' : '256px' }}>
            <Card className="p-4 wa-card" style={isMobile ? undefined : { position: 'sticky', top: '80px' }}>
              <div className="cv-sidebar-label">Navigation</div>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cv-nav-item${activeTab === tab.id ? ' cv-nav-item--active' : ''}`}
                      style={{ padding: '0.65rem 0.75rem' }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="cv-nav-title" style={{ fontWeight: 500 }}>{tab.label}</span>
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
