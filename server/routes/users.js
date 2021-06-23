import express from 'express'

import { addUser, getAllUsers } from "../controllers/user";

const router = express.Router();

const usersRouter = () => {

  router.post('/add', addUser);
  router.get('/getusers', getAllUsers)

  return router;

};

export default usersRouter;