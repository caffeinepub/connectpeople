import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { type Post } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetProfile } from '../hooks/useQueries';
import ReplyForm from './ReplyForm';
import { MessageCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PostCardProps {
  post: Post;
}

function AuthorName({ principalStr }: { principalStr: string }) {
  const { data: profile, isLoading } = useGetProfile(principalStr);
  if (isLoading) return <Skeleton className="h-4 w-24 inline-block" />;
  return (
    <Link
      to="/profile/$id"
      params={{ id: principalStr }}
      className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors font-display"
    >
      {profile?.displayName ?? 'Anonymous'}
    </Link>
  );
}

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  const now = Date.now();
  const diff = now - ms;

  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const authorStr = post.author.toString();

  return (
    <article className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-card hover:border-primary/25 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src="/assets/generated/avatar-placeholder.dim_128x128.png"
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
            />
          </div>
          <div>
            <AuthorName principalStr={authorStr} />
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {formatTime(post.timestamp)}
            </p>
          </div>
        </div>
        <span className="text-lg" title="Har Har Mahadev">🔱</span>
      </div>

      {/* Content */}
      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5 text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {/* Replies Section */}
      {expanded && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/25">
          {post.replies.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No replies yet. Be the first to respond!</p>
          ) : (
            post.replies.map((reply, idx) => (
              <div key={idx} className="bg-muted/40 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src="/assets/generated/avatar-placeholder.dim_128x128.png"
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <AuthorName principalStr={reply.author.toString()} />
                  <span className="text-xs text-muted-foreground ml-auto">{formatTime(reply.timestamp)}</span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{reply.content}</p>
              </div>
            ))
          )}
          {isAuthenticated && <ReplyForm postId={post.id} />}
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground italic">Login to add a reply.</p>
          )}
        </div>
      )}
    </article>
  );
}
