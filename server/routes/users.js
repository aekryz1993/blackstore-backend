import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addUser, getAllUsers } from "../controllers/user";

const router = express.Router();

const usersRouter = () => {

  router.post('/add', upload.single('picture'), addUser, addPicture);
  router.get('/getusers', getAllUsers)

  return router;

};

export default usersRouter;