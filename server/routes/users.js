import express from 'express'

import { addPicture } from '../controllers/image';
import uploadImage from '../controllers/middleware/image';
import uploadExcel, { readExcel } from '../controllers/middleware/excel';
import { addUser, getAllUsers, addMultiUser, updateProfilePicture, confirmPayment } from "../controllers/user";
import { addWallet, updateCredit } from '../controllers/wallet';
import { fetchNotConfirmedPayments } from '../controllers/payment';

const router = express.Router();

const usersRouter = (checkAdminPermission, ) => {

  router.post('/add', checkAdminPermission, uploadImage.single('picture'), addUser, addWallet, addPicture);
  router.post('/addMulti', checkAdminPermission, uploadExcel.single('excel'), readExcel, addMultiUser);
  router.get('/getusers', checkAdminPermission, getAllUsers)
  router.put('/updateCredit', checkAdminPermission, updateCredit)
  router.put('/updateUserPicture', checkAdminPermission, uploadImage.single('picture'), updateProfilePicture, addPicture)
  router.put('/confirmPayment', checkAdminPermission, confirmPayment)
  router.get('/payments', checkAdminPermission, fetchNotConfirmedPayments)

  return router;

};

export default usersRouter;