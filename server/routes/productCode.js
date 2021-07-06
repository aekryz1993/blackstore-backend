import express from 'express'

import upload, { readExcel } from '../controllers/middleware/excel';
import { addProductCode, getProductCodes, addMultiProductCode } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, addProductCode);
  router.post('/addMulti', checkAdminPermission, upload.single('excel'), readExcel, addMultiProductCode);
  router.get('/get', getProductCodes);

  return router;

};

export default productCodeRouter;