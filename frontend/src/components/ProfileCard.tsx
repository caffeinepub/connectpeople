import { Link } from '@tanstack/react-router';
import { type Profile } from '../backend';
import InterestTag from './InterestTag';
import { CalendarDays } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const profileId = profile.id.toString();

  return (
    <Link
      to="/profile/$id"
      params={{ id: profileId }}
      className="block group"
    >
      <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-card hover:border-primary/30 transition-all duration-300 h-full flex flex-col gap-3">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/assets/generated/avatar-placeholder.dim_128x128.png"
              alt={profile.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 text-xs">🔱</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors truncate text-sm">
              {profile.displayName}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              Joined {new Date(Number(profile.joinDate) / 1_000_000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-foreground/75 line-clamp-2 flex-1">{profile.bio}</p>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {profile.interests.slice(0, 4).map((interest) => (
              <InterestTag key={interest} label={interest} size="sm" />
            ))}
            {profile.interests.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">+{profile.interests.length - 4} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
