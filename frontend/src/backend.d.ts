import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reply {
    content: string;
    author: Principal;
    timestamp: bigint;
}
export interface Post {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: bigint;
    replies: Array<Reply>;
}
export interface Profile {
    id: Principal;
    bio: string;
    displayName: string;
    joinDate: bigint;
    interests: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReply(postId: bigint, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string): Promise<void>;
    createProfile(displayName: string, bio: string, interests: Array<string>): Promise<void>;
    findProfilesByInterests(interests: Array<string>): Promise<Array<Profile>>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(user: Principal): Promise<Profile | null>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(displayName: string, bio: string, interests: Array<string>): Promise<void>;
    updateProfile(displayName: string, bio: string, interests: Array<string>): Promise<void>;
}
