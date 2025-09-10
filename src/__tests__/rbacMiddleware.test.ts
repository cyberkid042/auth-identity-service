import { authorizeRoles } from '../middleware/rbac';

describe('RBAC Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() for user with allowed role', () => {
    mockReq.user = { role: 'admin' };
    const middleware = authorizeRoles('admin', 'moderator');

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 403 for user with insufficient permissions', () => {
    mockReq.user = { role: 'user' };
    const middleware = authorizeRoles('admin', 'moderator');

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when user is not authenticated', () => {
    const middleware = authorizeRoles('admin');

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should work with single role', () => {
    mockReq.user = { role: 'admin' };
    const middleware = authorizeRoles('admin');

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should work with multiple roles', () => {
    mockReq.user = { role: 'moderator' };
    const middleware = authorizeRoles('admin', 'moderator', 'user');

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
