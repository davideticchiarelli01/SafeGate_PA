import {Request, Response, NextFunction} from 'express';
import {validateAuthorizationIds} from "../middlewares/authorizationMiddleware";
import {StatusCodes} from "http-status-codes";

describe('validateAuthorizationIds middleware', () => {
    const getMockReq = (params: any): Partial<Request> => ({
        params,
    });

    const res = {} as Response;
    const next = jest.fn();

    const runMiddleware = async (middlewares: Function[], req: any, res: Response, next: NextFunction) => {
        for (const middleware of middlewares) {
            const maybePromise = middleware(req, res, next);
            if (maybePromise instanceof Promise) {
                await maybePromise;
            }
            if ((next as jest.Mock).mock.calls.length > 0 && (next as jest.Mock).mock.calls[0][0]) break;
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should pass with valid UUIDv4 badgeId and gateId', async () => {
        const req = getMockReq({
            badgeId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc",
            gateId: "696daf3b-f064-40b2-b229-7c9243cd2453"
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(); // no error
    });

    it('should fail if badgeId is missing', async () => {
        const req = getMockReq({
            gateId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc"
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Input validation failed",
            details: expect.arrayContaining([
                expect.objectContaining({field: "badgeId"})
            ])
        }));
    });

    it('should fail if gateId is not a UUID', async () => {
        const req = getMockReq({
            badgeId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc",
            gateId: 'not-a-uuid'
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            details: expect.arrayContaining([
                expect.objectContaining({
                    field: "gateId",
                    message: expect.stringContaining('must be a valid UUIDv4')
                })
            ])
        }));
    });

    it('should fail if both params are missing', async () => {
        const req = getMockReq({});
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            details: expect.arrayContaining([
                expect.objectContaining({field: "badgeId"}),
                expect.objectContaining({field: "gateId"})
            ])
        }));
    });

    it('should fail if badgeId is empty string', async () => {
        const req = getMockReq({
            badgeId: '',
            gateId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc"
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            details: expect.arrayContaining([
                expect.objectContaining({field: "badgeId"})
            ])
        }));
    });

    it('should fail if badgeId is empty string', async () => {
        const req = getMockReq({
            badgeId: [''],
            gateId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc"
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            details: expect.arrayContaining([
                expect.objectContaining({
                    field: "badgeId",
                    message: expect.stringContaining('must be a string')
                })
            ])
        }));
    });

    it('should fail if badgeId is null', async () => {
        const req = getMockReq({
            badgeId: null,
            gateId: "d706309c-f6f5-4390-b709-8c5ba9fa9dcc"
        });
        await runMiddleware(validateAuthorizationIds, req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: StatusCodes.BAD_REQUEST,
            details: expect.arrayContaining([
                expect.objectContaining({
                    field: "badgeId",
                    message: expect.stringContaining('must be a string')
                })
            ])
        }));
    });
});
