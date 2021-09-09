import express from 'express'

import servicesRouter from './user/services';
import productCategoryRouter from './user/productCategory'
import productIDRouter from './user/productID'
import walletRouter from './user/wallet';
import productCodeRouter from './user/productCode'
import { logout } from '../controllers/auth';
import uploadImage from '../controllers/middleware/image';
import { updateProfilePicture } from '../controllers/user';
import { addPicture } from '../controllers/image';
import { buyingCredit } from '../controllers/payment';
import { findAdmins } from '../models/query/user';

const router = express.Router();

const userSessionRouter = (io) => {
  const orderCommandNamespace = io.of("/orderCommands");
  orderCommandNamespace.on("connection", async (socket) => {
    const admins = await findAdmins()
    admins.forEach(admin => socket.join(admin.dataValues.id));
  });
  router.use('/services', servicesRouter());
  router.use('/wallet', walletRouter());
  router.use('/productCategory', productCategoryRouter());
  router.use('/productID', productIDRouter());
  router.use('/productCode', productCodeRouter(orderCommandNamespace));
  router.post('/payment/:codeID', buyingCredit);
  router.put('/updateProfilePicture', uploadImage.single('picture'), updateProfilePicture, addPicture);
  router.get('/logout', logout);

  return router;

};

export default userSessionRouter;