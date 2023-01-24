export interface UserInfo {
    isActive: boolean,
    userId: string;
    accessToken: string,
    role: string,
    username: string,
    email: string,
    expiresIn: number
}