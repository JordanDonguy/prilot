export interface IUser {
    id: string;
    password: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
