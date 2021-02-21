import express from 'express'

import { addProductCode, getProductCodes } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {

  router.post('/add', addProductCode);

  router.get('/get', getProductCodes);

  return router;

};

export default productCodeRouter;