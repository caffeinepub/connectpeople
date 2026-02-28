import { useState } from 'react';
import { useCreatePost } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createPost.mutateAsync(content.trim());
      setContent('');
      toast.success('🔱 Your message has been shared with the tribe!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
      <Textarea
        placeholder="Share your prayers, spiritual insights, or seva stories with the community... 🙏"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none rounded-xl border-border focus:border-primary mb-3"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Ctrl+Enter to post</p>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || createPost.isPending}
          className="rounded-full px-5 font-semibold"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {createPost.isPending ? 'Sharing...' : 'Share'}
        </Button>
      </div>
    </form>
  );
}
