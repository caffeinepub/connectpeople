import { useParams } from '@tanstack/react-router';
import { useGetProfile, useGetAllPosts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import InterestTag from '../components/InterestTag';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, FileText, UserCircle2 } from 'lucide-react';

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProfilePage() {
  const { id } = useParams({ from: '/profile/$id' });
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetProfile(id);
  const { data: allPosts, isLoading: postsLoading } = useGetAllPosts();

  const userPosts = allPosts?.filter((p) => p.author.toString() === id) ?? [];
  const isOwnProfile = identity?.getPrincipal().toString() === id;

  if (profileLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <UserCircle2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground/70 mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground">This profile doesn't exist or hasn't been set up yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4">
            <img
              src="/assets/generated/avatar-placeholder.dim_128x128.png"
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-card shadow-md"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground">{profile.displayName}</h1>
                {isOwnProfile && (
                  <span className="text-xs bg-primary/15 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(profile.joinDate)}
              </p>
            </div>

            {profile.bio && (
              <p className="text-foreground/80 leading-relaxed">{profile.bio}</p>
            )}

            {profile.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <InterestTag key={interest} label={interest} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg text-foreground">
            Posts <span className="text-muted-foreground font-normal text-base">({userPosts.length})</span>
          </h2>
        </div>

        {postsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <article key={post.id.toString()} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatTime(post.timestamp)}
                  {post.replies.length > 0 && (
                    <span className="ml-2">· {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
                  )}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
