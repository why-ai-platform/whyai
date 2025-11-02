import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  BookOpen, 
  Code2, 
  LayoutDashboard,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { CoursesPage } from './index';
import { PlaygroundPage } from './Playground';
import { DashboardPage } from '../dashboard';
import { motion, AnimatePresence } from 'motion/react';

interface CoursesLayoutProps {
  isLoggedIn: boolean;
}

export function CoursesLayout({ isLoggedIn }: CoursesLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      id: 'courses',
      label: 'All Courses',
      icon: BookOpen,
      path: '/courses',
      enabled: true,
    },
    {
      id: 'playground',
      label: 'Playground',
      icon: Code2,
      path: '/courses/playground',
      enabled: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/courses/dashboard',
      enabled: isLoggedIn,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/courses') {
      return location.pathname === '/courses';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Hub</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Courses, Practice & More
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            item.enabled && (
              <Button
                key={item.id}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            )
          ))}
        </div>

        {!isLoggedIn && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
              Login to unlock your personalized dashboard and track your progress!
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        className="fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:translate-x-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<CoursesPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="dashboard" element={isLoggedIn ? <DashboardPage /> : <CoursesPage />} />
        </Routes>
      </main>
    </div>
  );
}
