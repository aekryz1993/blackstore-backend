import express from 'express'

import { checkActivePermission, checkAdminPermission } from '../controllers/middleware/user';
import servicesRouter from './services';
import usersRouter from './users'
import productCategoryRouter from './productCategory'
import productIDRouter from './productID'

const router = express.Router();

const userSessionRouter = () => {

  router.get('/', (req, res) => {
    res.send('User Session');
  });

  router.use('/users', checkAdminPermission, usersRouter());
  router.use('/services', checkActivePermission, servicesRouter());
  router.use('/productCategory', checkActivePermission, productCategoryRouter());
  router.use('/productID', checkActivePermission, productIDRouter());

  return router;

};

export default userSessionRouter;