import { useState } from 'react';
import { useAddReply } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CornerDownRight } from 'lucide-react';

interface ReplyFormProps {
  postId: bigint;
}

export default function ReplyForm({ postId }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const addReply = useAddReply();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await addReply.mutateAsync({ postId, content: content.trim() });
      setContent('');
      toast.success('Reply added!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add reply';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className="resize-none rounded-xl text-sm flex-1"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!content.trim() || addReply.isPending}
        className="rounded-xl self-end px-3 font-semibold"
      >
        <CornerDownRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
