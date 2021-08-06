import express from 'express'

import servicesRouter from './user/services';
import productCategoryRouter from './user/productCategory'
import productIDRouter from './user/productID'
import productCodeRouter from './user/productCode'
import { logout } from '../controllers/auth';
import uploadImage from '../controllers/middleware/image';
import { updateProfilePicture } from '../controllers/user';
import { addPicture } from '../controllers/image';
import { buyingCredit } from '../controllers/payment';

const router = express.Router();

const userSessionRouter = () => {

  router.use('/services', servicesRouter());
  router.use('/productCategory', productCategoryRouter());
  router.use('/productID', productIDRouter());
  router.use('/productCode', productCodeRouter());
  router.post('/payment', buyingCredit);
  router.put('/updateProfilePicture', uploadImage.single('picture'), updateProfilePicture, addPicture);
  router.get('/logout', logout);

  return router;

};

export default userSessionRouter;