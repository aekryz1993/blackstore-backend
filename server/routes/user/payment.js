import express from 'express'

import { fetchPayments } from '../../controllers/payment';
// import { fetchPayments, fetchPayMethodAddress } from '../../controllers/payment';

const router = express.Router();

const usersRouter = () => {
  // router.get('/getPayMethodAddress', fetchPayMethodAddress)
  router.get('/payments/:currency', fetchPayments)
  return router;
};

export default usersRouter;
