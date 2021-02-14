import express from 'express'

import { checkActivePermission, checkAdminPermission } from '../controllers/middleware/user';
import servicesRouter from './services';
import usersRouter from './users'
import productCategoryRouter from './productCategory'

const router = express.Router();

const userSessionRouter = () => {

  router.get('/', (req, res) => {
    res.send('User Session');
  });

  router.use('/users', checkAdminPermission, usersRouter());
  router.use('/services', checkActivePermission, servicesRouter());
  router.use('/productCategory', checkActivePermission, productCategoryRouter());

  return router;

};

export default userSessionRouter;