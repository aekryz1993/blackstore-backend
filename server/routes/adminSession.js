import express from 'express'

import servicesRouter from './admin/services';
import productCategoryRouter from './admin/productCategory'
import productIDRouter from './admin/productID'
import productCodeRouter from './admin/productCode'
import usersRouter from './admin/users'

const router = express.Router();

const userSessionRouter = () => {
  router.use('/users', usersRouter());
  router.use('/services', servicesRouter());
  router.use('/productCategory', productCategoryRouter());
  router.use('/productID', productIDRouter());
  router.use('/productCode', productCodeRouter());

  return router;

};

export default userSessionRouter;