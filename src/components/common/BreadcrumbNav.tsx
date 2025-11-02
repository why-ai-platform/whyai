import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Home } from 'lucide-react';
import { ROUTES } from '../../constants';

interface BreadcrumbItem {
  label: string;
  path: string;
}

// Route mapping for friendly names
const getRouteLabel = (path: string): string => {
  const labels: Record<string, string> = {
    '/': 'Home',
    '/courses': 'Courses',
    '/dashboard': 'Dashboard',
    '/practice': 'Practice',
    '/profile': 'Profile',
  };
  
  // Check for exact match first
  if (labels[path]) {
    return labels[path];
  }
  
  // Handle nested routes
  if (path.startsWith('/courses')) {
    if (path.includes('playground')) return 'Playground';
    if (path.includes('dashboard')) return 'Dashboard';
  }
  
  // Format path segment
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ')
    : 'Home';
};

export function BreadcrumbNav({ items }: { items?: Array<{ label: string; path: string }> }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Skip breadcrumb on home page
  if (location.pathname === ROUTES.HOME && !items) {
    return null;
  }

  // Use provided items or generate from location
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: ROUTES.HOME }];

    let currentPath = '';
    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;
      crumbs.push({
        label: getRouteLabel(currentPath),
        path: currentPath,
      });
    });

    return crumbs;
  })();

  const handleClick = (path: string, label: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Handle special case: Playground tab within Courses page
    if (label === 'Playground') {
      // Store in sessionStorage to indicate playground tab should be active
      sessionStorage.setItem('activeTab', 'playground');
      navigate(ROUTES.COURSES);
      return;
    }
    
    navigate(path);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <div key={crumb.path} className="flex items-center">
                <BreadcrumbItem>
                  {index === 0 ? (
                    <BreadcrumbLink
                      onClick={(e) => handleClick(crumb.path, crumb.label, e)}
                      className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                  ) : isLast ? (
                    <BreadcrumbPage className="text-gray-900 dark:text-white font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={(e) => handleClick(crumb.path, crumb.label, e)}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <span className="text-gray-400">/</span>
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

