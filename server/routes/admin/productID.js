import express from 'express'
import { checkPermission } from '../../controllers/middleware/permissions';

import {
  addProductID,
  updateProductID,
  treatedRequestProductID,
} from "../../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.post('/add', checkPermission('addProduct'), addProductID);

  router.put('/update/:id', checkPermission('updateProduct'), updateProductID);

  router.put('/treatRequest/:id', treatedRequestProductID);

  return router;

};

export default productIDRouter;