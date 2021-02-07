import express from 'express'
import session from 'cookie-session'

import { localPassportStrategy, SESSION_SECRET_VALUE, expirySessionDate } from '../config/passport.config';
import authRouter from './auth';
import userSessionRouter from './userSession';

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

    app.get('/', (req, res) => {
        res.send('hello in user session')
    })

    router.use('/', passport.authenticationMiddleware, userSessionRouter(router));
    router.use('/auth', authRouter(passport, router));

    return router;
}

export default apiRouter;