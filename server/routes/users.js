import express from 'express'

import { addUser } from "../controllers/user";

const router = express.Router();

const usersRouter = () => {

  router.post('/add', addUser);

  return router;

};

export default usersRouter;