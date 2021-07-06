import express from 'express'

import upload, { readExcel } from '../controllers/middleware/excel';
import { addProductCode, getProductCodes, addMultiProductCode } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {

  router.post('/add', addProductCode);
  router.post('/addMulti', upload.single('excel'), readExcel, addMultiProductCode);
  router.get('/get', getProductCodes);

  return router;

};

export default productCodeRouter;