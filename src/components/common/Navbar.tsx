import { Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginDialog } from '../../pages/landing/LoginDialog';
import logo from '../../logo.png';
import { ROUTES } from '../../constants';
import { useIsMobile } from '../ui/use-mobile';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const isMobile = useIsMobile();
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

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: 500,
    color: active ? 'var(--wa-accent)' : 'var(--wa-text-secondary)',
    transition: 'color 0.15s',
  });

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />

      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'var(--wa-surface)',
          borderBottom: '1px solid var(--wa-border)',
        }}
      >
        <div className="mx-auto px-4" style={{ maxWidth: '1280px' }}>
          <div className="flex items-center justify-between" style={{ height: '56px' }}>
            <Link to={ROUTES.HOME} className="flex items-center">
              <motion.img
                src={logo}
                alt="WhyAi Logo"
                className="object-contain"
                style={{ height: '28px', width: 'auto' }}
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              />
            </Link>

            {!isMobile ? (
              <div className="flex items-center" style={{ gap: '28px' }}>
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} style={linkStyle(location.pathname === link.path)}>
                    {link.name}
                  </Link>
                ))}

                <div
                  className="flex items-center"
                  style={{ gap: '8px', padding: '4px 10px', borderRadius: 'var(--wa-radius-md)', background: 'var(--wa-bg)' }}
                >
                  <Sun className="w-3.5 h-3.5" style={{ color: 'var(--wa-text-secondary)' }} />
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  <Moon className="w-3.5 h-3.5" style={{ color: 'var(--wa-text-secondary)' }} />
                </div>

                {!isAuthenticated ? (
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <button className="wa-btn wa-btn-secondary" onClick={() => setShowLoginDialog(true)}>
                      Login
                    </button>
                    <button className="wa-btn wa-btn-primary" onClick={() => setShowLoginDialog(true)}>
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center" style={{ gap: '14px' }}>
                    <Link to={ROUTES.PROFILE} aria-label="Profile" style={{ color: 'var(--wa-text-secondary)' }}>
                      <User className="w-[18px] h-[18px]" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      aria-label="Log out"
                      style={{ color: 'var(--wa-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                      <LogOut className="w-[18px] h-[18px]" />
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--wa-text)' }}>{user?.name}</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                style={{ color: 'var(--wa-text)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>

          {isMobile && (
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ borderTop: '1px solid var(--wa-border)', overflow: 'hidden' }}
                  className="py-3"
                >
                  <div className="flex flex-col" style={{ gap: '4px' }}>
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2"
                        style={{
                          borderRadius: 'var(--wa-radius-md)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: location.pathname === link.path ? 'var(--wa-accent)' : 'var(--wa-text)',
                          background: location.pathname === link.path ? 'var(--wa-accent-tint)' : 'transparent',
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}

                    <div className="flex items-center justify-between px-3 py-2">
                      <span style={{ fontSize: '0.85rem', color: 'var(--wa-text-secondary)' }}>Dark Mode</span>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <Sun className="w-3.5 h-3.5" style={{ color: 'var(--wa-text-secondary)' }} />
                        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                        <Moon className="w-3.5 h-3.5" style={{ color: 'var(--wa-text-secondary)' }} />
                      </div>
                    </div>

                    {!isAuthenticated ? (
                      <div className="flex flex-col px-3" style={{ gap: '8px', paddingTop: '4px' }}>
                        <button
                          className="wa-btn wa-btn-secondary"
                          style={{ width: '100%' }}
                          onClick={() => {
                            setShowLoginDialog(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Login
                        </button>
                        <button
                          className="wa-btn wa-btn-primary"
                          style={{ width: '100%' }}
                          onClick={() => {
                            setShowLoginDialog(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col" style={{ paddingTop: '4px' }}>
                        <Link
                          to={ROUTES.PROFILE}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-3 py-2"
                          style={{ gap: '8px', fontSize: '0.9rem', color: 'var(--wa-text)' }}
                        >
                          <User className="w-4 h-4" />
                          Profile — {user?.name}
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center px-3 py-2"
                          style={{ gap: '8px', fontSize: '0.9rem', color: 'var(--wa-text)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </nav>
    </>
  );
}
