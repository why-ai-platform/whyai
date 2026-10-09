import { useState, useEffect, useRef } from 'react';
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
  Lock,
  Search
} from 'lucide-react';
import { courseContentData } from './courseContent';
import './courseDiagrams.css';
import './courseViewer.css';
import { ROUTES } from '../../../constants';
import { useIsMobile } from '../../../components/ui/use-mobile';

// Mobile/desktop is decided in JS (useIsMobile), not a CSS breakpoint class —
// a previous version of this page relied on Tailwind's `lg:`/`md:` variants to
// show/hide the sidebar and they silently never applied (src/index.css is a
// static pre-built file — see CLAUDE.md's gotchas list), so the chapter index
// was invisible at any screen width. This sidesteps that failure mode entirely.

export function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showMobileIndex, setShowMobileIndex] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const courseContent = id ? courseContentData[id] : null;

  useEffect(() => {
    const saved = localStorage.getItem(`course-${id}-completed`);
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
    setCurrentLessonIndex(0);
    setSearchQuery('');
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`course-${id}-completed`, JSON.stringify(Array.from(completedLessons)));
    }
  }, [completedLessons, id]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentLessonIndex]);

  // Add a working "Copy" button to every code block in the rendered lesson —
  // the lesson HTML is injected via dangerouslySetInnerHTML, so this is wired
  // up imperatively after render rather than as a React component.
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const cleanups: Array<() => void> = [];

    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('cv-code-block')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'cv-code-block';
      wrapper.style.position = 'relative';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cv-code-copy-btn';
      btn.textContent = 'Copy';
      const onClick = () => {
        const text = pre.textContent || '';
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            btn.textContent = 'Copied';
            setTimeout(() => {
              btn.textContent = 'Copy';
            }, 1500);
          })
          .catch(() => {
            btn.textContent = 'Press Ctrl+C';
          });
      };
      btn.addEventListener('click', onClick);
      wrapper.appendChild(btn);
      cleanups.push(() => btn.removeEventListener('click', onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, [currentLessonIndex, courseContent?.id]);

  if (!courseContent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--wa-bg)' }}>
        <Card className="p-8 text-center wa-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wa-text)', marginBottom: '0.75rem' }}>
            Course Not Found
          </h2>
          <p style={{ color: 'var(--wa-text-secondary)', marginBottom: '1.25rem' }}>
            The course you're looking for doesn't exist.
          </p>
          <button className="wa-btn wa-btn-primary" onClick={() => navigate(ROUTES.COURSES)}>
            <Home className="w-4 h-4" />
            Back to Courses
          </button>
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

  const IndexList = ({ onPick }: { onPick: (i: number) => void }) => {
    const q = searchQuery.trim().toLowerCase();
    const visible = lessons
      .map((lesson, index) => ({ lesson, index }))
      .filter(({ lesson }) => !q || lesson.title.toLowerCase().includes(q));

    if (visible.length === 0) {
      return (
        <p style={{ fontSize: '0.82rem', color: 'var(--wa-text-secondary)', padding: '0 0.5rem' }}>
          No chapters match "{searchQuery}".
        </p>
      );
    }

    return (
      <ol style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {visible.map(({ lesson, index }) => (
          <li key={lesson.id}>
            <button
              onClick={() => onPick(index)}
              disabled={lesson.locked}
              className={`cv-nav-item${index === currentLessonIndex && !lesson.locked ? ' cv-nav-item--active' : ''}`}
            >
              <span className="cv-nav-num">{index + 1}</span>
              {lesson.locked ? (
                <Lock className="w-3.5 h-3.5 cv-nav-lock" />
              ) : completedLessons.has(lesson.id) ? (
                <CheckCircle2 className="w-3.5 h-3.5 cv-nav-check" />
              ) : null}
              <span className="cv-nav-title">{lesson.title}</span>
            </button>
          </li>
        ))}
      </ol>
    );
  };

  const SearchBox = () => (
    <div style={{ position: 'relative' }}>
      <Search
        className="w-3.5 h-3.5"
        style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--wa-text-secondary)' }}
      />
      <input
        type="text"
        className="cv-search"
        style={{ paddingLeft: '1.9rem' }}
        placeholder="Search chapters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--wa-bg)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50" style={{ background: 'var(--wa-surface)', borderBottom: '1px solid var(--wa-border)' }}>
        <div className="mx-auto px-4" style={{ maxWidth: '1400px' }}>
          <div className="flex items-center justify-between gap-4" style={{ height: '52px' }}>
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.COURSES)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Courses
              </Button>
              {!isMobile && (
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--wa-text)' }} className="truncate">
                  {courseContent.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {!isMobile && (
                <div className="flex items-center gap-2" style={{ width: '160px' }}>
                  <Progress value={progress} className="h-1.5" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--wa-text-secondary)', whiteSpace: 'nowrap' }}>
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
            <aside className="flex-shrink-0 sticky" style={{ width: '272px', top: '68px' }}>
              <Card className="p-4 wa-card" style={{ maxHeight: 'calc(100vh - 92px)', overflowY: 'auto' }}>
                <div className="cv-sidebar-label">Course Content</div>
                {lessons.length > 8 && <SearchBox />}
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
                    className="fixed inset-0 z-40"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowMobileIndex(false)}
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="fixed right-0 top-0 h-full z-50 p-5"
                    style={{ width: '85vw', maxWidth: '320px', overflowY: 'auto', background: 'var(--wa-surface)' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wa-text)' }}>Chapters</h2>
                      <Button variant="ghost" size="sm" onClick={() => setShowMobileIndex(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {lessons.length > 8 && <SearchBox />}
                    <IndexList onPick={selectLesson} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Main content — one chapter at a time. Deliberately no enter/exit
              transition here: AnimatePresence's mode="wait" delays mounting
              the new chapter's real DOM until its exit animation finishes,
              which desyncs it from the currentLessonIndex state change and
              broke the copy-button injection effect below (it read the still-
              mounted previous chapter's content). A plain, un-animated swap
              is simpler, correct, and matches "avoid unnecessary animations". */}
          <main className="flex-1 min-w-0">
            <div key={currentLessonIndex}>
                <Card className="p-6 wa-card">
                  <div className="mx-auto" style={{ maxWidth: '700px' }}>
                    {currentLesson.locked ? (
                      <div className="text-center" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                        <Lock className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--wa-text-secondary)' }} />
                        <Badge variant="outline" className="mb-3">
                          Chapter {currentLessonIndex + 1} of {lessons.length}
                        </Badge>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--wa-text)', marginBottom: '0.75rem' }}>
                          {currentLesson.title}
                        </h1>
                        <div
                          ref={contentRef}
                          className="lesson-content"
                          style={{ textAlign: 'left' }}
                          dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />
                        <button className="wa-btn wa-btn-secondary mt-6" onClick={goPrevious}>
                          <ChevronLeft className="w-4 h-4" />
                          Back to previous chapter
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-2" style={{ fontSize: '0.825rem', color: 'var(--wa-text-secondary)' }}>
                          <Badge variant="outline">
                            Chapter {currentLessonIndex + 1} of {lessons.length}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {currentLesson.duration}
                          </span>
                        </div>
                        <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--wa-text)', marginBottom: '1.25rem', lineHeight: 1.3 }}>
                          {currentLesson.title}
                        </h1>

                        <div
                          ref={contentRef}
                          className="lesson-content"
                          dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />

                        <div className="flex items-center justify-between mt-8 pt-5" style={{ borderTop: '1px solid var(--wa-border)' }}>
                          <button
                            className={`wa-btn ${completedLessons.has(currentLesson.id) ? 'wa-btn-primary' : 'wa-btn-secondary'}`}
                            onClick={toggleComplete}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {completedLessons.has(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Previous / Next pager */}
                <div className="mx-auto flex items-center justify-between mt-4" style={{ maxWidth: '700px' }}>
                  <button
                    className="wa-btn wa-btn-secondary"
                    onClick={goPrevious}
                    disabled={currentLessonIndex === 0}
                    style={currentLessonIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {currentLessonIndex === 0 ? 'Start' : 'Previous'}
                  </button>
                  {currentLessonIndex < lastUnlockedIndex ? (
                    <button className="wa-btn wa-btn-primary" onClick={goNext}>
                      Next Chapter
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="wa-btn wa-btn-primary" onClick={() => navigate(ROUTES.COURSES)}>
                      <CheckCircle2 className="w-4 h-4" />
                      Finish Course
                    </button>
                  )}
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
