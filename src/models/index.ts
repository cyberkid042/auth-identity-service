import { Sequelize } from 'sequelize';
import { initUserModel, User } from './user';

const dbPath = process.env.DB_PATH || './authdb.sqlite';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

initUserModel(sequelize);

export { User };
