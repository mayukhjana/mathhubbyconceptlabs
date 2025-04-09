
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfileMenu from '@/components/UserProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, X, BookOpen, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DarkModeToggle } from './DarkModeToggle';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={cn("bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-4 sticky top-0 z-50", className)}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-mathdark dark:text-white">
          <BookOpen className="h-6 w-6 text-mathprimary" />
          MathHub
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/boards" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors">
            Boards
          </Link>
          <Link to="/exams" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors">
            Exams
          </Link>
          {isAuthenticated && (
            <Link to="/results" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors">
              Results
            </Link>
          )}
          <Link to="/premium" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors">
            Premium
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {isAuthenticated ? (
            <UserProfileMenu />
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobile && isMenuOpen && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 py-2 px-4">
          <div className="flex flex-col gap-4">
            <Link to="/boards" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors block">
              Boards
            </Link>
            <Link to="/exams" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors block">
              Exams
            </Link>
            {isAuthenticated && (
              <Link to="/results" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors block">
                Results
              </Link>
            )}
            <Link to="/premium" className="text-gray-600 hover:text-mathprimary dark:text-gray-300 dark:hover:text-mathprimary transition-colors block">
              Premium
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
