const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import { User } from './models/user.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug endpoint
app.get('/debug/users', async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'username'],
      raw: true 
    });
    console.log('Debug: Found users:', users);
    res.json(users);
  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error?.message || 'Unknown error occurred' });
  }
});

// Debug middleware to log all requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use(routes);
app.use(express.static('../client/dist'));

sequelize.sync({force: forceDatabaseRefresh}).then(async () => {
  console.log('Database connected');
  
  // Check for seeded user on startup
  try {
    const user = await User.findOne({ 
      where: { username: 'JollyGuru' },
      attributes: ['id', 'username']
    });
    console.log('Seeded user found:', user ? 'Yes' : 'No');
  } catch (error) {
    console.error('Error checking for seeded user:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});