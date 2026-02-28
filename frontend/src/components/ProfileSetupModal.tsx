import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InterestTag from './InterestTag';
import { toast } from 'sonner';
import { Flame } from 'lucide-react';

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

export default function ProfileSetupModal() {
  const navigate = useNavigate();
  const createProfile = useCreateProfile();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameError('Display name is required.');
      return;
    }
    setNameError('');
    try {
      await createProfile.mutateAsync({
        displayName: displayName.trim(),
        bio: bio.trim(),
        interests: selectedInterests,
      });
      toast.success('🔱 Welcome to Tribes Of Rudra! Har Har Mahadev!');
      navigate({ to: '/feed' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create profile';
      toast.error(message);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-bold">Welcome to Tribes Of Rudra!</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base">
            Set up your spiritual profile to connect with devotees who share your path. 🙏
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="font-semibold">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="displayName"
              placeholder="How should the tribe know you?"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              className="rounded-xl"
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="font-semibold">
              About You <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Share your spiritual journey, your connection to Lord Shiva, or your path of devotion..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Spiritual Interests <span className="text-muted-foreground font-normal">(pick any)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <InterestTag
                  key={interest}
                  label={interest}
                  selected={selectedInterests.includes(interest)}
                  onClick={() => toggleInterest(interest)}
                  selectable
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl font-semibold text-base py-5"
            disabled={createProfile.isPending}
          >
            {createProfile.isPending ? 'Joining the Tribe...' : '🔱 Join the Tribe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
