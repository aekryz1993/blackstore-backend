import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addService, fetchAllServices } from "../controllers/service";

const router = express.Router();

const servicesRouter = () => {
  router.post('/add', upload.single('picture'), addService, addPicture);
  router.get('/getAll', fetchAllServices);
  return router;
};

export default servicesRouter;