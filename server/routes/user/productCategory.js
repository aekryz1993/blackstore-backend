import express from 'express'

import { fetchProductCategoriessByService } from "../../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = () => {
  router.get('/get', fetchProductCategoriessByService);
  return router;
};

export default productCategoryRouter;