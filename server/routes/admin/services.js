import express from 'express'

import { addPicture } from '../../controllers/image';
import uploadImage from '../../controllers/middleware/image';
import { checkPermission } from '../../controllers/middleware/permissions';
import { addService, updateServicePicture } from "../../controllers/service";

const router = express.Router();

const servicesRouter = () => {
  router.post('/add', checkPermission('addProduct'), uploadImage.single('picture'), addService, addPicture);
  router.put('/updateServicePicture', checkPermission('updateProduct'), uploadImage.single('picture'), updateServicePicture, addPicture)
  return router;
};

export default servicesRouter;