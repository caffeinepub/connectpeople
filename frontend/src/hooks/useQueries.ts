import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Profile, type Post } from '../backend';
import { Principal } from '@dfinity/principal';

// ─── Profile Queries ────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Profile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetProfile(profileId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile | null>({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!actor || !profileId) return null;
      try {
        return await actor.getProfile(Principal.fromText(profileId));
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!profileId,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ displayName, bio, interests }: { displayName: string; bio: string; interests: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createProfile(displayName, bio, interests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ displayName, bio, interests }: { displayName: string; bio: string; interests: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfile(displayName, bio, interests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// ─── Post Queries ────────────────────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      return [...posts].sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      });
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useAddReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addReply(postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ─── Discovery Queries ───────────────────────────────────────────────────────

export function useFindProfilesByInterests(interests: string[]) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ['discover', interests],
    queryFn: async () => {
      if (!actor || interests.length === 0) return [];
      return actor.findProfilesByInterests(interests);
    },
    enabled: !!actor && !actorFetching && interests.length > 0,
  });
}
