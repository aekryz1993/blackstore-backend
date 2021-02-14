import express from 'express'

import { addProductCategory } from "../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = () => {

  router.post('/add', addProductCategory);

  return router;

};

export default productCategoryRouter;