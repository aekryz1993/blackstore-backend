import express from 'express'

import { addPicture } from '../../controllers/image';
import uploadImage from '../../controllers/middleware/image';
import {
  addProductID,
  treatedRequestProductID,
  updateProductIDPicture
} from "../../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.post('/add', uploadImage.single('picture'), addProductID, addPicture);

  router.put('/treatRequest', treatedRequestProductID);

  router.put('/updateProductIDPicture', uploadImage.single('picture'), updateProductIDPicture, addPicture)

  return router;

};

export default productIDRouter;