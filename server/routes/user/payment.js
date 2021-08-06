import express from 'express'

import { fetchPayMethodAddress } from '../../controllers/payment';

const router = express.Router();

const usersRouter = () => {
  router.get('/getPayMethodAddress', fetchPayMethodAddress)
  return router;
};

export default usersRouter;