import express from 'express'

import {
  addProductID,
  treatedRequestProductID,
} from "../../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.post('/add', addProductID);

  router.put('/treatRequest/:id', treatedRequestProductID);

  return router;

};

export default productIDRouter;