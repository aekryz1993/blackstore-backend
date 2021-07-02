import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addUser, getAllUsers } from "../controllers/user";
import { addWallet, updateCredit } from '../controllers/wallet';

const router = express.Router();

const usersRouter = () => {

  router.post('/add', upload.single('picture'), addUser, addWallet, addPicture);
  router.get('/getusers', getAllUsers)
  router.put('/updateCredit', updateCredit)

  return router;

};

export default usersRouter;