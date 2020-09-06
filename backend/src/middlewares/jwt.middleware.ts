import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';

/* declare module 'express' {
    interface Request {
        userInfo: any;
    }
} */

function validateToken(
    request: any,
    response: Response,
    next: NextFunction,
) {
    const redisUserTokenDb = process.env.redisUserTokenDb;
    const secret: any = process.env.JWTSECRET;
    const token =
        request.body.access_token ||
        request.query.access_token ||
        request.body.accessToken ||
        request.query.accessToken ||
        request.headers['api-access-token'];
    jwt.verify(token, secret, async (err: any, decoded: any) => {
        if (err) {
            return response.status(401).send(err.message);
        }
        try {
            const exist = '';
            // check if token exist or not
            if (exist != null) {
                request.userInfo = decoded;
                next();
            } else {
                return response.status(403).send('Invalid Access');
            }
        } catch (error) {
            return response.status(401).send(error);
        }
    });
}

export default validateToken;