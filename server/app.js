import express from 'express'
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import path from 'path';

import { SESSION_SECRET, SESSION_SECRET_VALUE } from './config/passport.config'
import apiRouter from './routes';

const app = express();
const CURRENT_WORKING_DIR = process.cwd();

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
    app.use(compression())
}

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(CURRENT_WORKING_DIR, 'resources')))
app.set(SESSION_SECRET, SESSION_SECRET_VALUE)

app.use('/api', apiRouter(app, passport));

export default app