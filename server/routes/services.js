import express from 'express'

import { addPicture } from '../controllers/image';
import uploadImage from '../controllers/middleware/image';
import { addService, fetchAllServices, updateServicePicture } from "../controllers/service";

const router = express.Router();

const servicesRouter = (checkAdminPermission, ) => {
  router.post('/add', checkAdminPermission, uploadImage.single('picture'), addService, addPicture);
  router.get('/getAll', fetchAllServices);
  router.put('/updateServicePicture', checkAdminPermission, uploadImage.single('picture'), updateServicePicture, addPicture)
  return router;
};

export default servicesRouter;