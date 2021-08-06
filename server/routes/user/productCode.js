import express from 'express'

import { getProductCodesByMultCategories } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {
  router.get('/get', getProductCodesByMultCategories);

  return router;

};

export default productCodeRouter;