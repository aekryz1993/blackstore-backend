import express from 'express'
import { fetchServices } from "../../controllers/service";

const router = express.Router();

const servicesRouter = () => {
  router.get('/getAll/:category', fetchServices);
  return router;
};

export default servicesRouter;