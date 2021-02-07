import express from 'express'

import { addService } from "../controllers/service";

const router = express.Router();

const servicesRouter = () => {

  router.post('/add', addService);

  return router;

};

export default servicesRouter;