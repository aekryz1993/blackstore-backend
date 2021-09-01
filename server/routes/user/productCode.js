import express from 'express'

import { getProductCodesByMultCategories, getSoldProductCodesByUser } from "../../controllers/productCode";
import { getCommandsByUser } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = () => {
  router.get('/get/availableCodes/:currency/:amount/:order/:serviceName', getProductCodesByMultCategories);
  router.get('/get/soldCodes', getSoldProductCodesByUser);
  router.get('/get/commands/:page/:isTreated', getCommandsByUser);
  return router;
};

export default productCodeRouter;