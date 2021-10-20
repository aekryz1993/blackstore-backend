import express from 'express'

import { readExcel } from '../../controllers/middleware/excel';
import uploadExcel from '../../controllers/middleware/excel';
import { addProductCategory, updateMultiPricesProductCategory, updateProductCategory } from "../../controllers/productCategory";
import { checkPermission } from '../../controllers/middleware/permissions';

const router = express.Router();

const productCategoryRouter = () => {
  router.post('/add', checkPermission('addProduct'), addProductCategory);

  router.put('/update/:id', checkPermission('updateProduct'), updateProductCategory);

  // router.put('/updatePrice/:id', checkPermission('updateProductPrice'), updatePriceProductCategory);

  router.put('/updateMiltiPrices', checkPermission('updateProductPrice'), uploadExcel(false), readExcel, updateMultiPricesProductCategory);
  
  return router;
};

export default productCategoryRouter;