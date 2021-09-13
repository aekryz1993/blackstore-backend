import express from 'express'

import { getProductCodesByMultCategories } from "../../controllers/productCode";
import { getCommandsByUser } from "../../controllers/commands";

const router = express.Router();

const productCodeRouter = (io, redisClient) => {
  router.get('/get/availableCodes/:currency/:amount/:order/:serviceName', getProductCodesByMultCategories(io, redisClient));
  router.get('/get/commands/:page/:isTreated', getCommandsByUser);
  return router;
};

export default productCodeRouter;