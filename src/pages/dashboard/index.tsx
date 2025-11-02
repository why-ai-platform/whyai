import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Brain,
  Layers,
  Eye,
  Sparkles,
  Star,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { ROUTES } from '../../constants';

const activityData = [
  { day: 'Mon', problems: 3, courses: 1 },
  { day: 'Tue', problems: 5, courses: 2 },
  { day: 'Wed', problems: 2, courses: 1 },
  { day: 'Thu', problems: 7, courses: 3 },
  { day: 'Fri', problems: 4, courses: 2 },
  { day: 'Sat', problems: 6, courses: 1 },
  { day: 'Sun', problems: 3, courses: 2 },
];

const recentCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    icon: Brain,
    progress: 65,
    lastAccessed: '2 hours ago',
    nextLesson: 'Gradient Descent Optimization',
  },
  {
    id: '2',
    title: 'Deep Learning',
    icon: Layers,
    progress: 42,
    lastAccessed: '1 day ago',
    nextLesson: 'Convolutional Neural Networks',
  },
  {
    id: '3',
    title: 'Computer Vision',
    icon: Eye,
    progress: 28,
    lastAccessed: '3 days ago',
    nextLesson: 'Object Detection Basics',
  },
];

const achievements = [
  {
    id: '1',
    title: '7-Day Streak',
    description: 'Practiced for 7 consecutive days',
    icon: Flame,
    earned: true,
    date: '2025-10-28',
  },
  {
    id: '2',
    title: 'Problem Solver',
    description: 'Solved 50 practice problems',
    icon: CheckCircle2,
    earned: true,
    date: '2025-10-25',
  },
  {
    id: '3',
    title: 'Course Completer',
    description: 'Completed first AI course',
    icon: Trophy,
    earned: true,
    date: '2025-10-20',
  },
  {
    id: '4',
    title: 'Fast Learner',
    description: 'Complete a course in under 2 weeks',
    icon: Zap,
    earned: false,
    date: null,
  },
  {
    id: '5',
    title: 'Expert',
    description: 'Master 5 advanced topics',
    icon: Star,
    earned: false,
    date: null,
  },
  {
    id: '6',
    title: 'AI Specialist',
    description: 'Complete all Gen AI courses',
    icon: Sparkles,
    earned: false,
    date: null,
  },
];

const recentProblems = [
  { id: '1', title: 'Neural Network Forward Pass', status: 'Solved', difficulty: 'Medium', time: '2 hours ago' },
  { id: '2', title: 'K-Means Clustering', status: 'Solved', difficulty: 'Easy', time: '5 hours ago' },
  { id: '3', title: 'Gradient Descent Implementation', status: 'Attempted', difficulty: 'Medium', time: '1 day ago' },
  { id: '4', title: 'Image Classification CNN', status: 'Solved', difficulty: 'Hard', time: '2 days ago' },
];

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access your dashboard
          </p>
          <Button 
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and achievements
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  +2 this week
                </Badge>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Courses Enrolled</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  +12 this week
                </Badge>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Problems Solved</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">127</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  Record: 28
                </Badge>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Day Streak</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  Top 5%
                </Badge>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">2,450</p>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(ROUTES.COURSES)}
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course, index) => {
                  const Icon = course.icon;
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(ROUTES.COURSES)}
                    >
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Next: {course.nextLesson}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Progress value={course.progress} className="h-2 flex-1" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{course.lastAccessed}</p>
                        <Button size="sm" className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600">
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weekly Activity</h2>
              <div className="space-y-4">
                {activityData.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{day.day}</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {day.problems + day.courses} activities
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.max(day.problems, 1) }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600"
                onClick={() => navigate(ROUTES.PRACTICE)}
              >
                Practice Now
              </Button>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="problems" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="problems">Recent Problems</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Problems</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(ROUTES.PRACTICE)}
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(ROUTES.PRACTICE)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        problem.status === 'Solved' 
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        {problem.status === 'Solved' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Code className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {problem.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {problem.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {problem.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      problem.status === 'Solved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }>
                      {problem.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-500'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-3 rounded-lg ${
                          achievement.earned
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            achievement.earned ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            Earned
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Earned on {achievement.date}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
