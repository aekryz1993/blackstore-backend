import express from 'express'

import {
  fetchProductIDsByService,
  sendRequestProductID,
} from "../../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.get('/get', fetchProductIDsByService);

  router.post('/send/:currentcoin', sendRequestProductID);

  return router;

};

export default productIDRouter;