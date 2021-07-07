import express from 'express'

import { addPicture } from '../controllers/image';
import { readExcel } from '../controllers/middleware/excel';
import uploadImage from '../controllers/middleware/image';
import uploadExcel from '../controllers/middleware/excel';
import { addProductCategory, fetchProductCategoriessByService, updateCategoryPicture, updateMultiPricesProductCategory, updatePriceProductCategory } from "../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = (checkAdminPermission) => {
  router.post('/add', checkAdminPermission, uploadImage.single('picture'), addProductCategory, addPicture);
  router.get('/get', fetchProductCategoriessByService);
  router.put('/updatePrice', checkAdminPermission, updatePriceProductCategory);
  router.put('/updateMiltiPrices', checkAdminPermission, uploadExcel.single('excel'), readExcel, updateMultiPricesProductCategory);
  router.put('/updateCategoryPicture', checkAdminPermission, uploadImage.single('picture'), updateCategoryPicture, addPicture)
  return router;
};

export default productCategoryRouter;