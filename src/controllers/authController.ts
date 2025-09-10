import { Request, Response } from 'express';
import zxcvbn from 'zxcvbn';
import { User } from '../models';

const disposableDomains = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  // Add more as needed
];

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check for disposable email
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return res.status(400).json({ error: 'Disposable emails are not allowed' });
    }

    // Check password strength
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({
        error: 'Password is too weak',
        suggestions: passwordStrength.feedback.suggestions,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user (password will be hashed by the model hook)
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
