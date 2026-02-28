import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

function Layout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/feed' });
  },
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: FeedPage,
});

const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discover',
  component: DiscoverPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$id',
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([indexRoute, feedRoute, discoverRoute, profileRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
