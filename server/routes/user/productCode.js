import express from 'express'

import { getProductCodesByMultCategories } from "../../controllers/productCode";
import { getCommandsByUser } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = (io) => {
  router.get('/get/availableCodes/:currency/:amount/:order/:serviceName', getProductCodesByMultCategories(io));
  router.get('/get/commands/:page/:isTreated', getCommandsByUser);
  return router;
};

export default productCodeRouter;