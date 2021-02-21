import express from 'express'

import {
  addProductID,
  fetchAllRequestsProductID,
  sendRequestProductID,
  treatedRequestProductID
} from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, addProductID);

  router.post('/send', sendRequestProductID);

  router.get('/requestsID', checkAdminPermission, fetchAllRequestsProductID);

  router.put('/treatRequest', checkAdminPermission, treatedRequestProductID);

  return router;

};

export default productIDRouter;