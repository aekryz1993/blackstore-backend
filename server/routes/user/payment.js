import express from 'express'

import { buyingCreditBinance, buyingCreditCoinbase, fetchPayments } from '../../controllers/payment';
// import { fetchPayments, fetchPayMethodAddress } from '../../controllers/payment';

const router = express.Router();

const paymentRouter = () => {
  // router.get('/getPayMethodAddress', fetchPayMethodAddress)
  router.post("/coinbase", buyingCreditCoinbase);
  router.post("/binance", buyingCreditBinance);
  router.get('/payments/:currency', fetchPayments)
  return router;
};

export default paymentRouter;
