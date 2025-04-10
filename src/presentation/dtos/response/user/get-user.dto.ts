export class UserResponseDto {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  signature: string | null;
  followerCount?: number;
  followingCount?: number;
  isMe?: boolean;
  isFollower?: boolean;
  isFollowing?: boolean;

  constructor(params: UserResponseDto) {
    this.id = params.id;
    this.fullName = params.fullName;
    this.username = params.username;
    this.avatar = params.avatar;
    this.signature = params.signature;
    this.followerCount = params.followerCount;
    this.followingCount = params.followingCount;
    this.isMe = params.isMe;
    this.isFollower = params.isFollower;
    this.isFollowing = params.isFollowing;
  }
}
