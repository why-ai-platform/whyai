import { Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginDialog } from '../../pages/landing/LoginDialog';
import logo from '../../logo.png';
import { ROUTES } from '../../constants';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Courses', path: ROUTES.COURSES },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: ROUTES.DASHBOARD }] : []),
  ];

  return (
    <>
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />
      
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo only */}
            <Link to={ROUTES.HOME} className="flex items-center">
              <motion.img
                src={logo}
                alt="WhyAi Logo"
                className="h-8 w-18 rounded-lg object-contain"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    location.pathname === link.path
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => setShowLoginDialog(true)}>
                    Login
                  </Button>
                  <Button 
                    onClick={() => setShowLoginDialog(true)} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to={ROUTES.PROFILE}>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === link.path
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  {!isAuthenticated ? (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setShowLoginDialog(true);
                          setMobileMenuOpen(false);
                        }} 
                        className="w-full"
                      >
                        Login
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowLoginDialog(true);
                          setMobileMenuOpen(false);
                        }} 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to={ROUTES.PROFILE} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Profile - {user?.name}
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
