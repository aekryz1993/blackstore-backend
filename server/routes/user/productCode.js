import express from 'express'

import { getProductCodesByMultCategories } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {
  router.get('/get/:currentWallet', getProductCodesByMultCategories);

  return router;

};

export default productCodeRouter;