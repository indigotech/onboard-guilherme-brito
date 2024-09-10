import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

export interface AuthenticationTokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface ContextPayload {
  userInfo: AuthenticationTokenPayload;
}

export const authenticationContext = async (args: { req: IncomingMessage }) => {
  const token = args.req.headers.authorization ?? '';

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY) as AuthenticationTokenPayload;
    return { userInfo };
  } catch {
    return null;
  }
};
