import express from 'express'

import { checkActivePermission, checkAdminPermission } from '../controllers/middleware/user';
import servicesRouter from './services';
import usersRouter from './users'
import productCategoryRouter from './productCategory'
import productIDRouter from './productID'
import productCodeRouter from './productCode'
import { logout } from '../controllers/auth';

const router = express.Router();

const userSessionRouter = () => {

  router.get('/', (req, res) => {
    res.send('User Session');
  });

  router.use('/users', checkAdminPermission, usersRouter());
  router.use('/services', checkAdminPermission, checkActivePermission, servicesRouter());
  router.use('/productCategory', checkAdminPermission, checkActivePermission, productCategoryRouter());
  router.use('/productID', checkActivePermission, productIDRouter(checkAdminPermission));
  router.use('/productCode', checkAdminPermission, checkActivePermission, productCodeRouter());
  router.get('/logout', logout);

  return router;

};

export default userSessionRouter;