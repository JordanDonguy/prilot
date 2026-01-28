export type InvitationStatus = "pending" | "accepted" | "declined";

export interface Member {
  id: string;
  username?: string;        // only present for active members
  email: string;            
  role?: string | null;     // only present for active members
  createdAt: Date;
  status?: InvitationStatus; // only present for members who have not joined yet
}
