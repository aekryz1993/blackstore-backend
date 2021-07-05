import express from 'express'

import { addPicture } from '../controllers/image';
import { readExcel } from '../controllers/middleware/excel';
import upload from '../controllers/middleware/excel';
import { addProductCategory, updateMultiPricesProductCategory, updatePriceProductCategory } from "../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = () => {
  router.post('/add', upload.single('picture'), addProductCategory, addPicture);
  router.put('/updatePrice', updatePriceProductCategory);
  router.put('/updateMiltiPrices', upload.single('excel'), readExcel, updateMultiPricesProductCategory);
  return router;
};

export default productCategoryRouter;