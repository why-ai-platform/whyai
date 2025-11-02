import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { LandingPage } from "./pages/landing";
import { CoursesPage } from "./pages/courses";
import { DashboardPage } from "./pages/dashboard";
import { PracticePage } from "./pages/practice";
import { ProfilePage } from "./pages/profile";
import { useDarkMode } from "./hooks/useDarkMode";
import { ROUTES } from "./constants";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />

          <Routes>
            <Route
              path={ROUTES.HOME}
              element={<LandingPage />}
            />
            <Route
              path={ROUTES.COURSES}
              element={<CoursesPage />}
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={<DashboardPage />}
            />
            <Route
              path={ROUTES.PRACTICE}
              element={<PracticePage />}
            />
            <Route
              path={ROUTES.PROFILE}
              element={<ProfilePage />}
            />
            <Route
              path="*"
              element={<Navigate to={ROUTES.HOME} replace />}
            />
          </Routes>

          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}