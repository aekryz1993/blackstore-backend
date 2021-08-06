import express from 'express'

import upload, { readExcel } from '../../controllers/middleware/excel';
import { addProductCode, addMultiProductCode } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {

  router.post('/add', addProductCode);
  router.post('/addMulti', upload.single('excel'), readExcel, addMultiProductCode);

  return router;

};

export default productCodeRouter;