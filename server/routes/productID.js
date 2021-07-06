import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import {
  addProductID,
  // fetchAllRequestsProductID,
  fetchProductIDsByService,
  sendRequestProductID,
  treatedRequestProductID
} from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.get('/get', fetchProductIDsByService);

  router.post('/add', checkAdminPermission, upload.single('picture'), addProductID, addPicture);

  router.post('/send', sendRequestProductID);

  // router.get('/requestsID', fetchAllRequestsProductID);

  router.put('/treatRequest', checkAdminPermission, treatedRequestProductID);

  return router;

};

export default productIDRouter;