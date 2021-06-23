import express from 'express'

import { addProductCode, getProductCodes } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {

  router.post('/add', addProductCode);

  router.post('/get', getProductCodes);

  return router;

};

export default productCodeRouter;