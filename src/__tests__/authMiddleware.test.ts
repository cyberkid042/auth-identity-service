import { authenticateToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() with valid token', () => {
    const payload = { userId: 1, email: 'test@example.com', role: 'user' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'test_jwt_secret');

    mockReq.headers.authorization = `Bearer ${token}`;

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toMatchObject(payload);
  });

  it('should return 401 without authorization header', () => {
    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 with malformed authorization header', () => {
    mockReq.headers.authorization = 'InvalidFormat';

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 with invalid token', () => {
    mockReq.headers.authorization = 'Bearer invalidtoken';

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 with expired token', () => {
    const payload = { userId: 1, email: 'test@example.com', role: 'user' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'test_jwt_secret', {
      expiresIn: '-1h',
    });

    mockReq.headers.authorization = `Bearer ${token}`;

    authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
