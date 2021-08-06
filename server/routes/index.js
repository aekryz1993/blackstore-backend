import express from 'express'
import session from 'cookie-session'

import { localPassportStrategy, SESSION_SECRET_VALUE, expirySessionDate } from '../config/passport.config';
import authRouter from './auth';
import userSessionRouter from './userSession';
import { checkActivePermission, checkAdminPermission } from '../controllers/middleware/permissions';
import adminSessionRouter from './adminSession';

const router = express.Router();

const apiRouter = (app, passport) => {
    app.use(session({
        name: 'session',
        keys: [SESSION_SECRET_VALUE],
        cookie: {
            secure: true,
            httpOnly: true,
            expires: expirySessionDate,
        }
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    localPassportStrategy(passport);

    router.use('/auth', authRouter(passport));
    router.use('/userSession', passport.authenticationMiddleware, checkActivePermission, userSessionRouter());
    router.use('/adminSession', passport.authenticationMiddleware, checkActivePermission, checkAdminPermission, adminSessionRouter());

    return router;
}

export default apiRouter;