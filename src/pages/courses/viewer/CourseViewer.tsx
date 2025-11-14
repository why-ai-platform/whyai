import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Home,
  List,
  X
} from 'lucide-react';
import { courseContentData } from './courseContent';
import { ROUTES } from '../../../constants';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

export function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const courseContent = id ? courseContentData[id] : null;

  useEffect(() => {
    // Load completed lessons from localStorage
    const saved = localStorage.getItem(`course-${id}-completed`);
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, [id]);

  useEffect(() => {
    // Save completed lessons to localStorage
    if (id) {
      localStorage.setItem(`course-${id}-completed`, JSON.stringify(Array.from(completedLessons)));
    }
  }, [completedLessons, id]);

  useEffect(() => {
    // Scroll to top when lesson changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLessonIndex]);

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(ROUTES.COURSES)}>
            <Home className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </Card>
      </div>
    );
  }

  const currentLesson = courseContent.lessons[currentLessonIndex];
  const progress = (completedLessons.size / courseContent.lessons.length) * 100;

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < courseContent.lessons.length - 1) {
      markCurrentAsCompleted();
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index);
    setShowSidebar(false);
  };

  const markCurrentAsCompleted = () => {
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
  };

  const toggleComplete = () => {
    if (completedLessons.has(currentLesson.id)) {
      setCompletedLessons(prev => {
        const next = new Set(prev);
        next.delete(currentLesson.id);
        return next;
      });
    } else {
      markCurrentAsCompleted();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.COURSES)}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Courses
              </Button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-xs">
                  {courseContent.title}
                </h1>
              </div>
            </div>

            {/* Center - Progress */}
            <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-md mx-8">
              <Progress value={progress} className="h-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {completedLessons.size}/{courseContent.lessons.length}
              </span>
            </div>

            {/* Right side */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile progress */}
          <div className="lg:hidden pb-3">
            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {completedLessons.size}/{courseContent.lessons.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Course Content
                </h2>
                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {courseContent.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        index === currentLessonIndex
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {completedLessons.has(lesson.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {index + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {showSidebar && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setShowSidebar(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Course Content
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {courseContent.lessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonSelect(index)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            index === currentLessonIndex
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {completedLessons.has(lesson.id) ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {index + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center mt-1">
                                <Clock className="w-3 h-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLessonIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-8 lg:p-10">
                  {/* Lesson Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">
                        Lesson {currentLessonIndex + 1} of {courseContent.lessons.length}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentLesson.duration}
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {currentLesson.title}
                    </h1>
                    <Button
                      variant={completedLessons.has(currentLesson.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={toggleComplete}
                      className="mb-6"
                    >
                      {completedLessons.has(currentLesson.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Lesson Image */}
                  {currentLesson.image && (
                    <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                      <ImageWithFallback
                        src={currentLesson.image}
                        alt={currentLesson.title}
                        className="w-full h-64 md:h-96 object-cover"
                      />
                    </div>
                  )}

                  {/* Lesson Content */}
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none
                      prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-p:text-gray-700 dark:prose-p:text-gray-300
                      prose-a:text-blue-600 dark:prose-a:text-blue-400
                      prose-strong:text-gray-900 dark:prose-strong:text-white
                      prose-code:text-blue-600 dark:prose-code:text-blue-400
                      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
                      prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
                      prose-li:text-gray-700 dark:prose-li:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-12 pt-8 border-t dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentLessonIndex === 0}
                      className="flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentLessonIndex < courseContent.lessons.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Next Lesson
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => navigate(ROUTES.COURSES)}
                        className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Course
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
