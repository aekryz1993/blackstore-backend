import express from 'express'

import { checkAdminPermission, checkSessionPermission } from '../controllers/middleware/user';
import servicesRouter from './services';
import usersRouter from './users'
import productCategoryRouter from './productCategory'
import productIDRouter from './productID'
import productCodeRouter from './productCode'
import { logout } from '../controllers/auth';
import uploadImage from '../controllers/middleware/image';
import { updateProfilePicture } from '../controllers/user';
import { addPicture } from '../controllers/image';

const router = express.Router();

const userSessionRouter = () => {

  router.use('/users', usersRouter(checkAdminPermission));
  router.use('/services', servicesRouter(checkAdminPermission));
  router.use('/productCategory', productCategoryRouter(checkAdminPermission));
  router.use('/productID', productIDRouter(checkAdminPermission));
  router.use('/productCode', productCodeRouter(checkAdminPermission));
  router.get('/logout', logout);
  router.put('/updateProfilePicture', checkSessionPermission, uploadImage.single('picture'), updateProfilePicture, addPicture);

  return router;

};

export default userSessionRouter;