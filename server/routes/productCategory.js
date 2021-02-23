import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addProductCategory } from "../controllers/productCategory";

const router = express.Router();

const productCategoryRouter = () => {

  router.post('/add', upload.single('picture'), addProductCategory, addPicture);

  return router;

};

export default productCategoryRouter;