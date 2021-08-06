import express from 'express'

import { addPicture } from '../../controllers/image';
import uploadImage from '../../controllers/middleware/image';
import uploadExcel, { readExcel } from '../../controllers/middleware/excel';
import { addUser, getAllUsers, addMultiUser, updateProfilePicture, confirmPayment, fetchAliveCommands } from "../../controllers/user";
import { addWallet, updateCredit } from '../../controllers/wallet';
import { addPayMethod, fetchNotConfirmedPayments, fetchPayMethodAddress } from '../../controllers/payment';

const router = express.Router();

const usersRouter = () => {

  router.post('/add', uploadImage.single('picture'), addUser, addWallet, addPicture);
  router.post('/addMulti', uploadExcel.single('excel'), readExcel, addMultiUser);
  router.get('/getusers', getAllUsers)
  router.put('/updateCredit/:userId', updateCredit)
  router.put('/updateUserPicture', uploadImage.single('picture'), updateProfilePicture, addPicture)
  router.put('/confirmPayment', confirmPayment)
  router.get('/payments', fetchNotConfirmedPayments)
  router.post('/addPayMethod', addPayMethod)
  router.get('/getPayMethodAddress', fetchPayMethodAddress)
  router.get('/getAliveCmnds', fetchAliveCommands)

  return router;

};

export default usersRouter;