import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Users, Compass, MessageSquare, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function NavBar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/feed' });
    setMobileOpen(false);
  };

  const handleLogin = () => {
    login();
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/feed', label: 'Sacred Feed', icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 group">
            <img
              src="/assets/generated/tribes-rudra-emblem.dim_256x256.png"
              alt="Tribes Of Rudra"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base text-primary tracking-wide group-hover:text-primary/80 transition-colors leading-none">
                Tribes Of Rudra
              </span>
              <span className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase leading-none mt-0.5">
                Har Har Mahadev
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                activeProps={{ className: 'text-primary bg-primary/10' }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && myPrincipal && (
              <Link
                to="/profile/$id"
                params={{ id: myPrincipal }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                activeProps={{ className: 'text-primary bg-primary/10' }}
              >
                <Users className="w-4 h-4" />
                {userProfile?.displayName ?? 'My Profile'}
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-full border-border hover:border-destructive hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                {isLoggingIn ? 'Connecting...' : 'Join the Tribe'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                activeProps={{ className: 'text-primary bg-primary/10' }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && myPrincipal && (
              <Link
                to="/profile/$id"
                params={{ id: myPrincipal }}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                activeProps={{ className: 'text-primary bg-primary/10' }}
              >
                <Users className="w-4 h-4" />
                {userProfile?.displayName ?? 'My Profile'}
              </Link>
            )}
            <div className="pt-2 px-4">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full rounded-full border-border hover:border-destructive hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  {isLoggingIn ? 'Connecting...' : 'Join the Tribe'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
