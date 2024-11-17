import { User } from '../models/user.js';
import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';

const safeSeed = async (): Promise<void> => {
  try {
    console.log('Checking for existing users...');
    const userCount = await User.count();
    
    if (userCount === 0) {
      console.log('No users found. Starting seed process...');
      
      // Run seeds without forcing sync
      await seedUsers();
      console.log('Users seeded successfully');
      
      await seedTickets();
      console.log('Tickets seeded successfully');
      
      // Verify seeding
      const verifyCount = await User.count();
      console.log(`Verification: ${verifyCount} users now in database`);
    } else {
      console.log(`Database already has ${userCount} users, skipping seed`);
    }
  } catch (error) {
    console.error('Error in safe seeding process:', error);
    throw error; // Re-throw to handle in calling code
  }
};

// Don't exit the process after seeding
export { safeSeed };