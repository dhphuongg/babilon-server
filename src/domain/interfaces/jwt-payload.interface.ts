export interface JwtPayload {
  userId: string;
  role: string;
}

export type UserAuth = JwtPayload;
