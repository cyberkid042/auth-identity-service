import express from 'express';
import { sequelize } from './models';
import authRoutes from './routes/auth';

// Entry point for Auth Identity Service
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

const logCurrentRoute = (path: String) => {
  console.log(`Request received for: ${path}`);
};

app.get('/', (_req, res) => {
  logCurrentRoute('/');
  res.send('Auth Identity Service is running!');
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to synchronize database:', err);
    process.exit(1);
  });
