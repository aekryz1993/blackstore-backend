import { signIn } from '../controllers/auth';

const authRouter = (passport, router) => {

  router.get('/', (req, res) => {
    res.send('LOG IN --------------- SIGN UP');
  });

  router.post('/login', signIn(passport));

  return router;

};

export default authRouter;