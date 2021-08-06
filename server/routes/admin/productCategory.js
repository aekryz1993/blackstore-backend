import express from 'express'

import { readExcel } from '../../controllers/middleware/excel';
import uploadExcel from '../../controllers/middleware/excel';
import { addProductCategory, updateMultiPricesProductCategory, updatePriceProductCategory } from "../../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = () => {
  router.post('/add', addProductCategory);
  router.put('/updatePrice/:id', updatePriceProductCategory);
  router.put('/updateMiltiPrices', uploadExcel.single('excel'), readExcel, updateMultiPricesProductCategory);
  return router;
};

export default productCategoryRouter;