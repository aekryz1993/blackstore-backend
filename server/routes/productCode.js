import express from 'express'

import { addProductCode } from "../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {

  router.post('/add', addProductCode);

  return router;

};

export default productCodeRouter;