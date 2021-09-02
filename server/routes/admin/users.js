import express from 'express'

import { addPicture } from '../../controllers/image';
import uploadImage from '../../controllers/middleware/image';
import uploadExcel, { readExcel } from '../../controllers/middleware/excel';
import { addUser, getAllUsers, addMultiUser, updateProfilePicture, confirmPayment, fetchAliveCommands } from "../../controllers/user";
import { addWallet, updateCredit } from '../../controllers/wallet';
import { addPayMethod, fetchNotConfirmedPayments } from '../../controllers/payment';
import { checkPermission } from '../../controllers/middleware/permissions';

const router = express.Router();

const usersRouter = () => {

  router.post('/add', checkPermission('addUser'), uploadImage.single('picture'), addUser, addWallet, addPicture);
  router.post('/addMulti', checkPermission('addUser'), uploadExcel.single('excel'), readExcel, addMultiUser);
  router.get('/getusers/:page', checkPermission('viewUser'), getAllUsers)
  router.put('/updateCredit/:userId', checkPermission('updateCredit'), updateCredit)
  router.put('/updateUserPicture/:userId', checkPermission('updateUser'), uploadImage.single('picture'), updateProfilePicture, addPicture)
  router.put('/confirmPayment/:id', checkPermission('confirmPayment'), confirmPayment)
  router.get('/payments', checkPermission('confirmPayment'), fetchNotConfirmedPayments)
  router.post('/addPayMethod', checkPermission('addPayMethod'), addPayMethod)

  return router;

};

export default usersRouter;