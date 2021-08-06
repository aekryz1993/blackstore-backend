import express from 'express'

import {
  // fetchAllRequestsProductID,
  fetchProductIDsByService,
  sendRequestProductID,
} from "../../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.get('/get', fetchProductIDsByService);

  router.post('/send', sendRequestProductID);

  // router.get('/requestsID', fetchAllRequestsProductID);

  return router;

};

export default productIDRouter;