import express from 'express'

import { addProductID, fetchAllRequestsProductID, sendRequestProductID } from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, addProductID);

  router.post('/send', sendRequestProductID);

  router.get('/requestsID', fetchAllRequestsProductID);

  return router;

};

export default productIDRouter;