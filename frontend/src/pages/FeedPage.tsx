import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllPosts } from '../hooks/useQueries';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Flame, Heart, Globe, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const PILLARS = [
  {
    icon: <Heart className="w-7 h-7 text-primary" />,
    title: 'Devotion',
    description: 'Deepen your Bhakti and surrender to Lord Shiva through prayer, ritual, and daily practice.',
  },
  {
    icon: <Sparkles className="w-7 h-7 text-primary" />,
    title: 'Sewa',
    description: 'Serve humanity as an act of worship. Every act of selfless service is an offering to Mahadev.',
  },
  {
    icon: <BookOpen className="w-7 h-7 text-primary" />,
    title: 'Knowledge',
    description: 'Explore the Vedas, Upanishads, Agamas, and the timeless wisdom of Sanatana Dharma.',
  },
  {
    icon: <Globe className="w-7 h-7 text-primary" />,
    title: 'Global Connection',
    description: 'Unite with devotees from every corner of the world. One tribe, one consciousness, one Shiva.',
  },
];

export default function FeedPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: posts, isLoading, error } = useGetAllPosts();

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/assets/generated/tribes-of-rudra-hero.dim_1920x800.png"
          alt="Tribes Of Rudra"
          className="w-full h-[420px] sm:h-[520px] object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-4 animate-float">
            <img
              src="/assets/generated/tribes-rudra-emblem.dim_256x256.png"
              alt="Tribes Of Rudra Emblem"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-primary/60 shadow-sacred mx-auto"
            />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white drop-shadow-lg tracking-wide mb-2">
            Tribes Of Rudra
          </h1>
          <p className="text-primary text-lg sm:text-xl font-display font-semibold tracking-widest mb-2 drop-shadow">
            ॐ नमः शिवाय
          </p>
          <p className="text-white/85 text-base sm:text-lg font-medium max-w-xl mb-6 drop-shadow">
            Har Har Mahadev — Connect. Grow. Serve.
          </p>
          {!isAuthenticated && (
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="lg"
              className="rounded-full px-8 py-3 font-display font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-sacred transition-all"
            >
              {isLoggingIn ? 'Connecting...' : '🔱 Join the Tribe'}
            </Button>
          )}
          {isAuthenticated && (
            <Link to="/discover">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-3 font-display font-bold text-base border-white/60 text-white hover:bg-white/15 hover:border-white transition-all"
              >
                <Globe className="w-4 h-4 mr-2" />
                Discover Devotees
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* ── SPIRITUAL DIVIDER ── */}
      <div className="w-full overflow-hidden">
        <img
          src="/assets/generated/spiritual-divider.dim_1200x80.png"
          alt=""
          className="w-full h-16 object-cover object-center"
        />
      </div>

      {/* ── WHO WE ARE ── */}
      <section className="bg-card border-b border-border py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-display font-semibold tracking-widest text-sm uppercase mb-3">Who We Are</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5">
            A Sacred Global Family
          </h2>
          <p className="text-foreground/75 text-base sm:text-lg leading-relaxed mb-4">
            <strong className="text-primary">Tribes Of Rudra</strong> is a global spiritual community devoted to <strong>Lord Shiva</strong> and the eternal wisdom of <strong>Hinduism</strong>. We are seekers, devotees, yogis, and servants — united by the sacred thread of Sanatana Dharma.
          </p>
          <p className="text-foreground/65 text-base leading-relaxed">
            From the Himalayas to every corner of the globe, we gather here to share our spiritual journeys, deepen our practice, and work together for the good of all beings. Every soul is welcome on this path.
          </p>
        </div>
      </section>

      {/* ── FOUR PILLARS ── */}
      <section className="py-14 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary font-display font-semibold tracking-widest text-sm uppercase mb-3">Our Path</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              The Four Pillars of the Tribe
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-card hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  {pillar.icon}
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOOD CAUSE ── */}
      <section className="py-14 px-4 bg-primary/5 border-y border-primary/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-display font-semibold tracking-widest text-sm uppercase mb-3">Good Cause</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5">
            Serving Humanity, Serving Shiva
          </h2>
          <p className="text-foreground/75 text-base sm:text-lg leading-relaxed mb-6">
            The Tribes Of Rudra community actively works for the upliftment of all beings. From supporting temple restoration projects and feeding the hungry, to spreading Vedic education and environmental conservation — our seva knows no boundaries.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['Temple Restoration', 'Annadanam (Food Seva)', 'Vedic Education', 'Environmental Care', 'Community Healing'].map((cause) => (
              <span
                key={cause}
                className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-medium"
              >
                {cause}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY FEED ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Feed Header */}
        <div className="text-center mb-8">
          <p className="text-primary font-display font-semibold tracking-widest text-sm uppercase mb-2">Sacred Feed</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Voices of the Tribe
          </h2>
          <p className="text-muted-foreground text-sm">
            Har Har Mahadev 🔱 — Share your prayers, insights, and stories with the global community.
          </p>
        </div>

        {/* Create Post */}
        {isAuthenticated ? (
          <div className="mb-6">
            <CreatePostForm />
          </div>
        ) : (
          <div className="mb-6 bg-primary/8 border border-primary/20 rounded-2xl p-5 text-center">
            <p className="text-sm text-foreground/70 mb-3">
              <span className="font-display font-semibold text-primary">Join the Tribe</span> to share your spiritual journey with devotees worldwide.
            </p>
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="sm"
              className="rounded-full px-6 font-semibold"
            >
              {isLoggingIn ? 'Connecting...' : '🔱 Login to Share'}
            </Button>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-foreground">Latest from the Community</h3>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-center">
              <p className="text-sm text-destructive">Failed to load posts. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && posts?.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground/70 mb-1">No posts yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to share your spiritual journey with the tribe!</p>
            </div>
          )}

          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id.toString()} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
