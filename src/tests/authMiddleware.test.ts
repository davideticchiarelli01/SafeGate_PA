import { Request, Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware, gateOrAdminMiddleware, userOrAdminMiddleware } from '../middlewares/authMiddleware';
import * as jwtUtils from '../utils/jwt';
import * as userPayloadUtils from '../utils/userPayload';

jest.mock('../utils/jwt');
jest.mock('../utils/userPayload');

describe('authMiddleware', () => {
    const mockRequest = () => ({ headers: { authorization: 'Bearer token123' } }) as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    it('should set req.user if token is valid', async () => {
        const mockPayload = { id: '123', role: 'admin' };
        (jwtUtils.extractAndValidateJwtToken as jest.Mock).mockReturnValue('token123');
        (jwtUtils.getPublicJwtKey as jest.Mock).mockResolvedValue('publicKey');
        (jwtUtils.jwtVerify as jest.Mock).mockReturnValue(mockPayload);
        (userPayloadUtils.validateUserPayload as jest.Mock).mockReturnValue(mockPayload);

        const req = mockRequest();
        await authMiddleware(req, mockResponse, mockNext);

        expect(req.user).toEqual(mockPayload);
        expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with error on failure', async () => {
        (jwtUtils.extractAndValidateJwtToken as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const req = mockRequest();
        await authMiddleware(req, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});

describe('adminMiddleware', () => {
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    beforeEach(() => {
        mockNext.mockClear();
    });

    it('should call next if user is admin', () => {
        const req = { user: { role: 'admin' } } as Request;
        adminMiddleware(req, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    });

    it('should return forbidden error if not admin', () => {
        const req = { user: { role: 'user' } } as Request;
        adminMiddleware(req, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Forbidden, administrators only can perform this action',
        }));
    });
});

describe('gateOrAdminMiddleware', () => {
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    beforeEach(() => {
        mockNext.mockClear();
    });

    it('should call next if user is gate or admin', () => {
        const reqAdmin = { user: { role: 'admin' } } as Request;
        gateOrAdminMiddleware(reqAdmin, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    })

    it('should call next if user is gate or admin', () => {
        const reqGate = { user: { role: 'gate' } } as Request;
        gateOrAdminMiddleware(reqGate, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    })

    it('should return forbidden if not admin or gate', () => {
        const reqUser = { user: { role: 'user' } } as Request;
        gateOrAdminMiddleware(reqUser, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Forbidden, only gate or admin users can perform this action',
        }));
    });
});

describe('userOrAdminMiddleware', () => {
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    beforeEach(() => {
        mockNext.mockClear();
    });

    it('should call next if user is user or admin', () => {
        const reqAdmin = { user: { role: 'admin' } } as Request;
        userOrAdminMiddleware(reqAdmin, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    })

    it('should call next if user is user or admin', () => {
        const reqUser = { user: { role: 'user' } } as Request;
        userOrAdminMiddleware(reqUser, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    })

    it('should return forbidden if not admin or user', () => {
        const reqGate = { user: { role: 'gate' } } as Request;
        userOrAdminMiddleware(reqGate, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Forbidden, only users or administrators can perform this action',
        }));
    });
});
