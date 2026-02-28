import { useState } from 'react';
import { useFindProfilesByInterests } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProfileCard from '../components/ProfileCard';
import InterestTag from '../components/InterestTag';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Users, Lock } from 'lucide-react';

const INTERESTS = [
  'Shaivism',
  'Vedanta',
  'Yoga',
  'Meditation',
  'Bhakti',
  'Sewa (Service)',
  'Sanskrit',
  'Ayurveda',
  'Pilgrimage',
  'Mantra & Chanting',
  'Sacred Texts',
  'Rudraksha',
  'Tantra',
  'Temple Arts',
  'Hinduism',
];

export default function DiscoverPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { data: profiles, isLoading } = useFindProfilesByInterests(
    isAuthenticated ? selectedInterests : []
  );

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Discover Devotees</h1>
        </div>
        <p className="text-muted-foreground ml-13">
          Find fellow seekers who share your spiritual path. Select your interests to connect with the tribe.
        </p>
      </div>

      {/* Interest Filter */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8 shadow-sm">
        <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Filter by Spiritual Path
        </h2>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <InterestTag
              key={interest}
              label={interest}
              selected={selectedInterests.includes(interest)}
              selectable
              onClick={() => toggleInterest(interest)}
            />
          ))}
        </div>
        {selectedInterests.length > 0 && (
          <button
            onClick={() => setSelectedInterests([])}
            className="mt-3 text-xs text-muted-foreground hover:text-destructive transition-colors underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Auth Gate */}
      {!isAuthenticated && (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-foreground/70 mb-1">Login to Discover Devotees</h3>
          <p className="text-sm text-muted-foreground">Sign in to find fellow seekers who share your spiritual path.</p>
        </div>
      )}

      {/* Results */}
      {isAuthenticated && (
        <>
          {selectedInterests.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Compass className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground/70 mb-1">Select your spiritual interests</h3>
              <p className="text-sm text-muted-foreground">Choose one or more paths above to discover your tribe.</p>
            </div>
          )}

          {selectedInterests.length > 0 && isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedInterests.length > 0 && !isLoading && profiles?.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground/70 mb-1">No devotees found yet</h3>
              <p className="text-sm text-muted-foreground">
                No one with those interests yet. Invite fellow seekers to join the tribe!
              </p>
            </div>
          )}

          {selectedInterests.length > 0 && !isLoading && profiles && profiles.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  {profiles.length} {profiles.length === 1 ? 'devotee' : 'devotees'} found
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id.toString()} profile={profile} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
