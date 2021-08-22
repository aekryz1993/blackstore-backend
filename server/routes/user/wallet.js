import express from 'express'

import { fetchCurrentCredit } from '../../controllers/wallet';

const router = express.Router();

const walletRouter = () => {
  router.get('/getCredit', fetchCurrentCredit)
  return router;
};

export default walletRouter;