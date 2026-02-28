import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include Storage
  include MixinStorage();

  // Include Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  type Profile = {
    id : Principal;
    displayName : Text;
    bio : Text;
    interests : [Text];
    joinDate : Int;
  };

  module Profile {
    public func compareByJoinDate(profile1 : Profile, profile2 : Profile) : Order.Order {
      if (profile1.joinDate < profile2.joinDate) {
        #greater;
      } else if (profile1.joinDate > profile2.joinDate) {
        #less;
      } else {
        #equal;
      };
    };
  };

  type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Int;
    replies : [Reply];
  };

  module Post {
    public func compareByTimestamp(post1 : Post, post2 : Post) : Order.Order {
      if (post1.timestamp < post2.timestamp) {
        #greater;
      } else if (post1.timestamp > post2.timestamp) {
        #less;
      } else {
        #equal;
      };
    };
  };

  type Reply = {
    author : Principal;
    content : Text;
    timestamp : Int;
  };

  // State
  var nextPostId = 0;
  let profiles = Map.empty<Principal, Profile>();
  let posts = Map.empty<Nat, Post>();

  // Profile API
  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(displayName : Text, bio : Text, interests : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };

    let joinDate = switch (profiles.get(caller)) {
      case (?existing) { existing.joinDate };
      case (null) { Time.now() };
    };

    let profile : Profile = {
      id = caller;
      displayName;
      bio;
      interests;
      joinDate;
    };

    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    profiles.get(user);
  };

  public shared ({ caller }) func createProfile(displayName : Text, bio : Text, interests : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    if (profiles.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };

    let newProfile : Profile = {
      id = caller;
      displayName;
      bio;
      interests;
      joinDate = Time.now();
    };

    profiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateProfile(displayName : Text, bio : Text, interests : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile does not exist");
    };

    let updatedProfile : Profile = {
      id = caller;
      displayName;
      bio;
      interests;
      joinDate = profiles.get(caller).unwrap().joinDate;
    };

    profiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?Profile {
    profiles.get(user);
  };

  // Post API
  public shared ({ caller }) func createPost(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile does not exist");
    };

    let newPost : Post = {
      id = nextPostId;
      author = caller;
      content;
      timestamp = Time.now();
      replies = [];
    };

    posts.add(nextPostId, newPost);
    nextPostId += 1;
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByTimestamp);
  };

  public shared ({ caller }) func addReply(postId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add replies");
    };

    if (not profiles.containsKey(caller)) {
      Runtime.trap("Profile does not exist");
    };

    let post = switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?p) { p };
    };

    let newReply : Reply = {
      author = caller;
      content;
      timestamp = Time.now();
    };

    let updatedReplies = post.replies.concat([newReply]);
    let updatedPost = { post with replies = updatedReplies };

    posts.add(postId, updatedPost);
  };

  func interestsOverlap(a : [Text], b : [Text]) : Bool {
    for (interest in a.values()) {
      if (b.find(func(x) { x == interest }) != null) {
        return true;
      };
    };
    false;
  };

  // Interest-Based Discovery
  public query ({ caller }) func findProfilesByInterests(interests : [Text]) : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can discover profiles by interests");
    };

    profiles.values().toArray().filter(
      func(p) {
        p.id != caller and interestsOverlap(p.interests, interests)
      }
    ).sort(Profile.compareByJoinDate);
  };
};
