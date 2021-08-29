import express from 'express'

import { getCommandsByUser, getProductCodesByMultCategories, getSoldProductCodesByUser } from "../../controllers/productCode";

const router = express.Router();

const productCodeRouter = () => {
  router.get('/get/availableCodes/:currency/:amount/:order/:serviceName', getProductCodesByMultCategories);
  router.get('/get/soldCodes', getSoldProductCodesByUser);
  router.get('/get/commands/:page/:isTreated', getCommandsByUser);
  return router;
};

export default productCodeRouter;