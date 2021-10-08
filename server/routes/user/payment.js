import express from 'express'

import { fetchCoinbaseCharges, fetchPayMethodAddress } from '../../controllers/payment';

const router = express.Router();

const usersRouter = () => {
  router.get('/getPayMethodAddress', fetchPayMethodAddress)
  router.get('/getCoinbaseCharges/:userId', fetchCoinbaseCharges)
  return router;
};

export default usersRouter;