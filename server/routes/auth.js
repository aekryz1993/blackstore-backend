import express from 'express'

import { signIn } from '../controllers/auth';

const router = express.Router();

const authRouter = (passport) => {

  router.post('/login', signIn(passport));

  return router;

};

export default authRouter;