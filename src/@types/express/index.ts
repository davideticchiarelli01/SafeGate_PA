import { UserPayload } from "../../utils/userPayload"

/**
 * Extends the Express `Request` interface to include an optional `user` property.
 * This property is typically populated after successful authentication via middleware.
 *
 * @namespace Express
 * @interface Request
 * @property {UserPayload} [user] - The authenticated user's payload attached to the request.
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
