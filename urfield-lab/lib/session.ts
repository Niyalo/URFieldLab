import type { SessionOptions } from 'iron-session';

export interface SessionData {
  isLoggedIn: boolean;
  _id: string;
  name: string;
  login_name: string;
  pictureURL?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'urfieldlab-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};