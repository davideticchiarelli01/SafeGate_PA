import { UserPayload } from "../../utils/userPayload"

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
