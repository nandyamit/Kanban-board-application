// routes/auth-routes.ts
import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  console.log('Login attempt received:', { username: req.body.username });

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user with password for comparison
    const user = await User.findOne({ 
      where: { username },
      raw: true
    });

    console.log('User lookup result:', user ? 'Found' : 'Not found');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation:', validPassword ? 'Valid' : 'Invalid');

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000)  // Added: explicit issued at time
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '2h',  // Keep your 2-hour absolute expiration
        notBefore: 0  // Token is valid immediately
      }
    );

    console.log('Login successful for user:', username);
    
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Server error during login',
      details: error?.message || 'Unknown error occurred'
    });
  }
};

const router = Router();
router.post('/login', login);

export default router;