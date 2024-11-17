#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be fully available..."
sleep 5

# Change to server directory
cd server

# Run the seeding check using ES modules
echo "Checking and seeding database if needed..."
NODE_ENV=production node --loader ts-node/esm --experimental-modules --es-module-specifier-resolution=node << EOF
import { safeSeed } from './dist/seeds/production-seed.js';

async function runSeed() {
  try {
    await safeSeed();
    console.log('Seed check completed successfully');
  } catch (err) {
    console.error('Seed check failed:', err);
    process.exit(1);
  }
}

runSeed();
EOF

# Start the application
cd ..
exec "$@"