import { signIn } from '../controllers/auth';

const authRouter = (app, passport, router) => {

  router.get('/', (req, res) => {
    res.send('LOG IN --------------- SIGN UP');
  });

  router.post('/login', signIn(app, passport));

  return router;

};

export default authRouter;