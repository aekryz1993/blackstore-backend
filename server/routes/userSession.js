import { checkAdminPermission } from '../controllers/middleware/user';
import usersRouter from './users'

const userSessionRouter = (router) => {

  router.get('/', (req, res) => {
    res.send('LOG IN --------------- SIGN UP');
  });

  router.use('/users', checkAdminPermission, usersRouter(router));

  return router;

};

export default userSessionRouter;