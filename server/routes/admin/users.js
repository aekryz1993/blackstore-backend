import express from 'express'

// import { addPicture } from '../../controllers/image';
// import uploadImage from '../../controllers/middleware/image';
import uploadExcel, { readExcel } from '../../controllers/middleware/excel';
import { addUser, getAllUsers, addMultiUser, confirmPayment, updateUser } from "../../controllers/user";
import { updateCredit } from '../../controllers/wallet';
// import { addPayMethod, fetchNotConfirmedPayments } from '../../controllers/payment';
import { checkPermission } from '../../controllers/middleware/permissions';
import { updatePermission } from '../../controllers/permission';

const router = express.Router();

const usersRouter = (redisClient) => {

  router.post('/add', checkPermission('addUser'), addUser(redisClient));

  router.post('/addMulti', checkPermission('addUser'), uploadExcel(false), readExcel, addMultiUser(redisClient));

  router.get('/update/:id', checkPermission('updateUser'), updateUser())

  router.get('/permissions/update/:userId', checkPermission('updatePermissions'), updatePermission())

  router.get('/getusers/:page', checkPermission('viewUser'), getAllUsers())

  router.put('/wallet/update/:userId', checkPermission('updateCredit'), updateCredit)

  router.put('/confirmPayment/:id', checkPermission('confirmPayment'), confirmPayment)

  // router.get('/payments', checkPermission('confirmPayment'), fetchNotConfirmedPayments)

  // router.post('/addPayMethod', checkPermission('addPayMethod'), addPayMethod)
  
  return router;

};

export default usersRouter;