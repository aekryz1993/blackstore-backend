import express from 'express'

import { addPicture } from '../controllers/image';
import uploadImage from '../controllers/middleware/image';
import {
  addProductID,
  // fetchAllRequestsProductID,
  fetchProductIDsByService,
  sendRequestProductID,
  treatedRequestProductID,
  updateProductIDPicture
} from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.get('/get', fetchProductIDsByService);

  router.post('/add', checkAdminPermission, uploadImage.single('picture'), addProductID, addPicture);

  router.post('/send', sendRequestProductID);

  // router.get('/requestsID', fetchAllRequestsProductID);

  router.put('/treatRequest', checkAdminPermission, treatedRequestProductID);

  router.put('/updateProductIDPicture', checkAdminPermission, uploadImage.single('picture'), updateProductIDPicture, addPicture)

  return router;

};

export default productIDRouter;