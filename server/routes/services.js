import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addService, fetchAllServices } from "../controllers/service";

const router = express.Router();

const servicesRouter = (checkAdminPermission, ) => {
  router.post('/add', checkAdminPermission, upload.single('picture'), addService, addPicture);
  router.get('/getAll', fetchAllServices);
  return router;
};

export default servicesRouter;