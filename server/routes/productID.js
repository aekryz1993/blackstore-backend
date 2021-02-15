import express from 'express'

import { addProductID, sendRequestProductID } from "../controllers/productID";

const router = express.Router();

const productIDRouter = (checkAdminPermission) => {

  router.post('/add', checkAdminPermission, addProductID);

  router.post('/send', sendRequestProductID);

  return router;

};

export default productIDRouter;