import express from 'express'
import { fetchAllServices } from "../../controllers/service";

const router = express.Router();

const servicesRouter = () => {
  router.get('/getAll', fetchAllServices);
  return router;
};

export default servicesRouter;