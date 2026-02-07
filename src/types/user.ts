export type IOAuthProvider = "github" | "gitlab";

export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
  oauthProviders?: IOAuthProvider[];
}
