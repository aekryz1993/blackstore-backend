import express from 'express'

import { addPicture } from '../controllers/image';
import upload from '../controllers/middleware/image';
import { addService } from "../controllers/service";

const router = express.Router();

const servicesRouter = () => {

  router.post('/add', upload.single('picture'), addService, addPicture);

  return router;

};

export default servicesRouter;