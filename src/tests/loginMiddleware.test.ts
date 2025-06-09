import { Request, Response, NextFunction } from 'express';
import { validateLogin } from '../middlewares/loginMiddleware';

describe('validateLogin middleware', () => {
    const getMockReq = (body: any): Partial<Request> => ({
        body,
    });

    const res = {} as Response;
    const next = jest.fn();

    const runMiddleware = async (middlewares: Function[], req: any, res: Response, next: NextFunction) => {
        for (const middleware of middlewares) {
            const maybePromise = middleware(req, res, next);
            if (maybePromise instanceof Promise) {
                await maybePromise;
            }
            // Se `next` è stato chiamato con un errore, blocca l’esecuzione
            if ((next as jest.Mock).mock.calls.length > 0 && (next as jest.Mock).mock.calls[0][0]) break;
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should pass with valid email and password', async () => {
        const req = getMockReq({ email: 'test@example.com', password: 'password123' });
        await runMiddleware(validateLogin, req, res, next);
        expect(next).toHaveBeenCalledWith(); // next() chiamato senza errori
    });

    it('should fail if email is missing', async () => {
        const req = getMockReq({ password: 'password123' });
        await runMiddleware(validateLogin, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Input validation failed',
            details: expect.arrayContaining([
                expect.objectContaining({ field: 'email' }),
            ])
        }));
    });

    it('should fail if email is not a string', async () => {
        const req = getMockReq({ email: 123 });
        await runMiddleware(validateLogin, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Input validation failed',
            details: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Email must be a string'
                }),
            ])
        }));
    });

    it('should fail if email doesn\'t respect Regex', async () => {
        const req = getMockReq({ email: 'email' });
        await runMiddleware(validateLogin, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Input validation failed',
            details: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Email format is invalid'
                }),
            ])
        }));
    });

    it('should fail if password is not a string', async () => {
        const req = getMockReq({ email: 'test@example.com', password: 123 });
        await runMiddleware(validateLogin, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Input validation failed',
            details: expect.arrayContaining([
                expect.objectContaining({ field: 'password' }),
            ])
        }));
    });
});
