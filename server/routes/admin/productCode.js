import express from 'express'

import upload, { readExcel } from '../../controllers/middleware/excel';
import { checkPermission } from '../../controllers/middleware/permissions';
import { addProductCode, addMultiProductCode } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {
  router.post('/add', checkPermission('addProduct'), addProductCode);
  router.post('/addMulti', checkPermission('addProduct'), upload.single('excel'), readExcel, addMultiProductCode);
  return router;
};

export default productCodeRouter;