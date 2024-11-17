// server/src/models/index.ts
import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
let sequelize: Sequelize;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize({
    database: 'kanban_db',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    dialect: 'postgres'
  });
}

export { sequelize };