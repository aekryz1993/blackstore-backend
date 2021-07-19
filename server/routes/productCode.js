import express from 'express'

import upload, { readExcel } from '../controllers/middleware/excel';
import { addProductCode, addMultiProductCode, getProductCodesByMultCategories } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, addProductCode);
  router.post('/addMulti', checkAdminPermission, upload.single('excel'), readExcel, addMultiProductCode);
  router.get('/get', getProductCodesByMultCategories);

  return router;

};

export default productCodeRouter;