import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import {
  addProductID,
  fetchAllRequestsProductID,
  sendRequestProductID,
  treatedRequestProductID
} from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, upload.single('picture'), addProductID, addPicture);

  router.post('/send', sendRequestProductID);

  router.get('/requestsID', checkAdminPermission, fetchAllRequestsProductID);

  router.put('/treatRequest', checkAdminPermission, treatedRequestProductID);

  return router;

};

export default productIDRouter;