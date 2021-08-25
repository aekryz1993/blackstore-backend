import express from 'express'

import { getProductCodesByMultCategories } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {
  router.get('/get/:currency/:amount/:order/:serviceName', getProductCodesByMultCategories);

  return router;

};

export default productCodeRouter;