import express from 'express'
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';

import {SESSION_SECRET, SESSION_SECRET_VALUE} from './config/passport.config'
import apiRouter from './routes';

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
    app.use(compression())
}

app.use(helmet())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set(SESSION_SECRET, SESSION_SECRET_VALUE)

app.use('/api', apiRouter(app, passport));

export default app