// server/src/server.ts
const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
dotenv.config();
import { safeSeed } from './seeds/production-seed.js';  // Add this import
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import { User } from './models/user.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log(`${_req.method} ${_req.path}`);
  next();
});

// Log all requests
app.use((_req, _res, next) => {
  console.log(`${_req.method} ${_req.path}`);
  next();
});

// API Routes
app.use(routes);

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../../client/dist/assets')));
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle React routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

// Database connection and server start
sequelize.sync({force: forceDatabaseRefresh}).then(async () => {
  console.log('Database connected');
  
  try {
    // Run safe seeding if in production
    if (process.env.NODE_ENV === 'production') {
      await safeSeed();
    }
    
    // Check for seeded user
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