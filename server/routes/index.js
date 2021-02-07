import express from 'express'
import session from 'cookie-session'

import { localPassportStrategy, SESSION_SECRET_VALUE, expirySessionDate } from '../config/passport.config';
import authRouter from './auth';

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
        console.log(req.session)
        res.send('hello in user session')
    })

    // router.use('/', passport.authenticationMiddleware, userRouter(app, router));
    router.use('/auth', authRouter(app, passport, router));

    return router;
}

export default apiRouter;