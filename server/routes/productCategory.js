import express from 'express'

import { addPicture } from '../controllers/image';
import { readExcel } from '../controllers/middleware/excel';
import upload from '../controllers/middleware/image';
import uploadExcel from '../controllers/middleware/excel';
import { addProductCategory, fetchProductCategoriessByService, updateMultiPricesProductCategory, updatePriceProductCategory } from "../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = (checkAdminPermission) => {
  router.post('/add', checkAdminPermission, upload.single('picture'), addProductCategory, addPicture);
  router.get('/get', fetchProductCategoriessByService);
  router.put('/updatePrice', checkAdminPermission, updatePriceProductCategory);
  router.put('/updateMiltiPrices', checkAdminPermission, uploadExcel.single('excel'), readExcel, updateMultiPricesProductCategory);
  return router;
};

export default productCategoryRouter;