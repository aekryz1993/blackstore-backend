import express from 'express'

import { checkAdminPermission } from '../controllers/middleware/user';
import servicesRouter from './services';
import usersRouter from './users'
import productCategoryRouter from './productCategory'
import productIDRouter from './productID'
import productCodeRouter from './productCode'
import { logout } from '../controllers/auth';

const router = express.Router();

const userSessionRouter = () => {

  router.use('/users', usersRouter(checkAdminPermission));
  router.use('/services', servicesRouter(checkAdminPermission));
  router.use('/productCategory', productCategoryRouter(checkAdminPermission));
  router.use('/productID', productIDRouter(checkAdminPermission));
  router.use('/productCode', productCodeRouter(checkAdminPermission));
  router.get('/logout', logout);

  return router;

};

export default userSessionRouter;