// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  username: string;
  iat: number;    // Added: issued at time
  exp: number;    // Added: expiration time
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Add inactivity check
    const currentTime = Math.floor(Date.now() / 1000);
    const inactivityPeriod = currentTime - decoded.iat;
    const maxInactivityPeriod = 5 * 60; // 5 minutes in seconds (changed from 30 to 5)

    if (inactivityPeriod > maxInactivityPeriod) {
      return res.status(401).json({ message: 'Session expired due to inactivity' });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};