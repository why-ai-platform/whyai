import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Home,
  List,
  X,
  Lock
} from 'lucide-react';
import { courseContentData } from './courseContent';
import './courseDiagrams.css';
import './courseViewer.css';
import { ROUTES } from '../../../constants';
import { useIsMobile } from '../../../components/ui/use-mobile';

// Mobile/desktop is decided in JS (useIsMobile), not a CSS breakpoint class —
// a previous version of this page relied on Tailwind's `lg:` variant to show/hide
// the sidebar and it silently never applied, so the chapter index was invisible
// at any screen width. This sidesteps that failure mode entirely.

export function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showMobileIndex, setShowMobileIndex] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const courseContent = id ? courseContentData[id] : null;

  useEffect(() => {
    const saved = localStorage.getItem(`course-${id}-completed`);
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
    setCurrentLessonIndex(0);
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`course-${id}-completed`, JSON.stringify(Array.from(completedLessons)));
    }
  }, [completedLessons, id]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
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

  const lessons = courseContent.lessons;
  const currentLesson = lessons[currentLessonIndex];
  const unlockedLessons = lessons.filter((l) => !l.locked);
  const lastUnlockedIndex = lessons.reduce((acc, l, i) => (!l.locked ? i : acc), 0);
  const progress = unlockedLessons.length
    ? (completedLessons.size / unlockedLessons.length) * 100
    : 0;

  const selectLesson = (index: number) => {
    if (lessons[index]?.locked) return;
    setCurrentLessonIndex(index);
    setShowMobileIndex(false);
  };

  const goPrevious = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex(currentLessonIndex - 1);
  };

  const goNext = () => {
    if (currentLessonIndex < lastUnlockedIndex) {
      setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const toggleComplete = () => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(currentLesson.id)) {
        next.delete(currentLesson.id);
      } else {
        next.add(currentLesson.id);
      }
      return next;
    });
  };

  const IndexList = ({ onPick }: { onPick: (i: number) => void }) => (
    <ol style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {lessons.map((lesson, index) => (
        <li key={lesson.id}>
          <button
            onClick={() => onPick(index)}
            disabled={lesson.locked}
            className={`cv-nav-item${index === currentLessonIndex && !lesson.locked ? ' cv-nav-item--active' : ''}`}
          >
            <span className="cv-nav-num">{index + 1}</span>
            {lesson.locked ? (
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            ) : completedLessons.has(lesson.id) ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
            ) : null}
            <span className="cv-nav-title">{lesson.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="mx-auto px-4" style={{ maxWidth: '1400px' }}>
          <div className="flex items-center justify-between gap-4" style={{ height: '56px' }}>
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.COURSES)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Courses
              </Button>
              {!isMobile && (
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {courseContent.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {!isMobile && (
                <div className="flex items-center gap-2" style={{ width: '160px' }}>
                  <Progress value={progress} className="h-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {completedLessons.size}/{unlockedLessons.length}
                  </span>
                </div>
              )}
              {isMobile && (
                <Button variant="outline" size="sm" onClick={() => setShowMobileIndex(true)}>
                  <List className="w-4 h-4 mr-1" />
                  Chapters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4" style={{ maxWidth: '1400px', paddingTop: '24px', paddingBottom: '24px' }}>
        <div className="flex gap-8 items-start">
          {/* Always-visible left nav on desktop/tablet */}
          {!isMobile && (
            <aside
              className="flex-shrink-0 sticky"
              style={{ width: '280px', top: '72px' }}
            >
              <Card className="p-4" style={{ maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
                <div className="cv-sidebar-label">Course Content</div>
                <IndexList onPick={selectLesson} />
              </Card>
            </aside>
          )}

          {/* Mobile index as a slide-over */}
          {isMobile && (
            <AnimatePresence>
              {showMobileIndex && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowMobileIndex(false)}
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="fixed right-0 top-0 h-full bg-white dark:bg-gray-800 z-50 p-5"
                    style={{ width: '85vw', maxWidth: '320px', overflowY: 'auto' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                        Chapters
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => setShowMobileIndex(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <IndexList onPick={selectLesson} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Main content — one chapter at a time */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLessonIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <div className="mx-auto" style={{ maxWidth: '720px' }}>
                    {currentLesson.locked ? (
                      <div className="text-center" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                        <Lock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <Badge variant="outline" className="mb-3">
                          Chapter {currentLessonIndex + 1} of {lessons.length}
                        </Badge>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {currentLesson.title}
                        </h1>
                        <div
                          className="lesson-content"
                          style={{ textAlign: 'left' }}
                          dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />
                        <Button variant="outline" className="mt-6" onClick={goPrevious}>
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back to previous chapter
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <Badge variant="outline">
                            Chapter {currentLessonIndex + 1} of {lessons.length}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {currentLesson.duration}
                          </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ lineHeight: 1.25 }}>
                          {currentLesson.title}
                        </h1>

                        <div
                          className="lesson-content"
                          dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />

                        <div className="flex items-center justify-between mt-10 pt-6 border-t dark:border-gray-700">
                          <Button
                            variant={completedLessons.has(currentLesson.id) ? 'default' : 'outline'}
                            size="sm"
                            onClick={toggleComplete}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {completedLessons.has(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Home / Next pager, W3Schools-style */}
                <div className="mx-auto flex items-center justify-between mt-4" style={{ maxWidth: '720px' }}>
                  <Button variant="outline" onClick={goPrevious} disabled={currentLessonIndex === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {currentLessonIndex === 0 ? 'Start' : 'Previous'}
                  </Button>
                  {currentLessonIndex < lastUnlockedIndex ? (
                    <Button
                      onClick={goNext}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Next Chapter
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(ROUTES.COURSES)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Finish Course
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
