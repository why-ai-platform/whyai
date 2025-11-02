import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { LoginDialog } from './LoginDialog';

const aiTerms = [
  { text: 'Artificial Intelligence', color: 'from-blue-500 to-cyan-500' },
  { text: 'Machine Learning', color: 'from-purple-500 to-pink-500' },
  { text: 'Deep Learning', color: 'from-green-500 to-emerald-500' },
  { text: 'Gen AI', color: 'from-orange-500 to-red-500' },
];

export function Hero() {
  const navigate = useNavigate();
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    const currentTerm = aiTerms[currentTermIndex].text;
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;

    if (!isDeleting && charIndex === currentTerm.length) {
      // Finished typing, pause then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next term
      setIsDeleting(false);
      setCurrentTermIndex((prev) => (prev + 1) % aiTerms.length);
      const timeout = setTimeout(() => setCharIndex(0), pauseBeforeType);
      return () => clearTimeout(timeout);
    }

    // Type or delete character
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(currentTerm.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setDisplayedText(currentTerm.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentTermIndex]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Learn from Industry Experts</span>
          </motion.div>

          {/* Typing Effect Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white min-h-[1.2em]">
              Master{' '}
              <span className={`bg-gradient-to-r ${aiTerms[currentTermIndex].color} bg-clip-text text-transparent`}>
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Your comprehensive platform to understand, learn, and practice Artificial Intelligence, 
            Machine Learning, Deep Learning, and cutting-edge technologies like Generative AI and Agentic AI. 
            From basics to advanced, we've got you covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setIsLoginDialogOpen(true)}
              className="text-lg px-8 py-6 border-2"
            >
              <LogIn className="mr-2 w-5 h-5" />
              <span>Sign In</span>
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate(ROUTES.COURSES)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
            >
              <span>Start Learning</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                200+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                1000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learners</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </section>
  );
}
