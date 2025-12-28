export interface IOAuthProvider {
  provider: string;
  username: string;
}

export interface IUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  oauthProviders?: IOAuthProvider[];
}
