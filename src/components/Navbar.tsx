import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Menu, X, Home, FileText, Award, LogIn, Book, BarChart3, Sun, Moon, BrainCircuit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useTheme } from "@/components/ThemeProvider";
import { Toggle } from "@/components/ui/toggle";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {
    isAuthenticated
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return <header className="sticky top-0 w-full bg-background/95 backdrop-blur-sm border-b z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mathprimary to-mathsecondary flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-display font-bold">MathHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant={isActive("/") ? "default" : "ghost"} className="flex items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Button>
          </Link>
          <Link to="/boards">
            <Button variant={isActive("/boards") ? "default" : "ghost"} className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Papers</span>
            </Button>
          </Link>
          <Link to="/exams">
            <Button variant={isActive("/exams") ? "default" : "ghost"} className="flex items-center gap-2">
              <FileText size={18} />
              <span>Practice Exams</span>
            </Button>
          </Link>
          <Link to="/exam-papers">
            <Button variant={isActive("/exam-papers") ? "default" : "ghost"} className="flex items-center gap-2">
              <Book size={18} />
              <span>Entrance Exams</span>
            </Button>
          </Link>
          <Link to="/results">
            <Button variant={isActive("/results") ? "default" : "ghost"} className="flex items-center gap-2">
              <BarChart3 size={18} />
              <span>Results</span>
            </Button>
          </Link>
          {isAuthenticated && <Link to="/mathhub-ai">
              <Button variant={isActive("/mathhub-ai") ? "default" : "ghost"} className="flex items-center gap-2">
                <BrainCircuit size={18} />
                <span>MathHub AI</span>
              </Button>
            </Link>}
          <Link to="/premium">
            <Button variant={isActive("/premium") ? "default" : "ghost"} className="flex items-center gap-2">
              <Award size={18} />
              <span>Premium</span>
            </Button>
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-2">
          <Toggle pressed={theme === "dark"} onPressedChange={toggleTheme} aria-label="Toggle theme" className="mr-2">
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </Toggle>

          {isAuthenticated ? <UserProfileMenu /> : <>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link to="/auth">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=register">Get Started</Link>
              </Button>
            </>}
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="fixed inset-0 top-16 z-50 bg-background h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <Link to="/" onClick={closeMenu}>
              <Button variant={isActive("/") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <Home className="mr-3" size={20} />
                Home
              </Button>
            </Link>
            <Link to="/boards" onClick={closeMenu}>
              <Button variant={isActive("/boards") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <BookOpen className="mr-3" size={20} />
                Papers
              </Button>
            </Link>
            <Link to="/exams" onClick={closeMenu}>
              <Button variant={isActive("/exams") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <FileText className="mr-3" size={20} />
                Practice Exams
              </Button>
            </Link>
            <Link to="/exam-papers" onClick={closeMenu}>
              <Button variant={isActive("/exam-papers") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <Book className="mr-3" size={20} />
                Exam Papers
              </Button>
            </Link>
            <Link to="/results" onClick={closeMenu}>
              <Button variant={isActive("/results") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <BarChart3 className="mr-3" size={20} />
                Results
              </Button>
            </Link>
            {isAuthenticated && <Link to="/mathhub-ai" onClick={closeMenu}>
                <Button variant={isActive("/mathhub-ai") ? "default" : "ghost"} className="w-full justify-start text-lg">
                  <BrainCircuit className="mr-3" size={20} />
                  MathHub AI
                </Button>
              </Link>}
            <Link to="/premium" onClick={closeMenu}>
              <Button variant={isActive("/premium") ? "default" : "ghost"} className="w-full justify-start text-lg">
                <Award className="mr-3" size={20} />
                Premium
              </Button>
            </Link>
            
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <span>Dark Mode</span>
              <Toggle pressed={theme === "dark"} onPressedChange={toggleTheme} aria-label="Toggle theme">
                {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </Toggle>
            </div>
            
            <div className="pt-6 flex flex-col space-y-4">
              {isAuthenticated ? <Button variant="destructive" className="w-full" onClick={() => {
            const {
              signOut
            } = useAuth();
            signOut();
            closeMenu();
          }}>
                  Sign Out
                </Button> : <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth" onClick={closeMenu}>Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/auth?tab=register" onClick={closeMenu}>Get Started</Link>
                  </Button>
                </>}
            </div>
          </div>
        </div>}
    </header>;
};
export default Navbar;