import express from 'express'

import upload, { readExcel } from '../../controllers/middleware/excel';
import { checkPermission } from '../../controllers/middleware/permissions';
import { addProductCode, addMultiProductCode } from "../../controllers/productCode";
import { getCommands } from '../../controllers/commands';

const router = express.Router();

const productCodeRouter = () => {
  router.post('/add', checkPermission('addProduct'), addProductCode);
  router.post('/addMulti', checkPermission('addProduct'), upload.single('excel'), readExcel, addMultiProductCode);
  router.get('/getCommands/:page/:isTreated', checkPermission('viewcmnd'), getCommands);
  return router;
};

export default productCodeRouter;