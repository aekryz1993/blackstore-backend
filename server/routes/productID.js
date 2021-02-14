import express from 'express'

import { addProductID } from "../controllers/productID";

const router = express.Router();

const productIDRouter = () => {

  router.post('/add', addProductID);

  return router;

};

export default productIDRouter;