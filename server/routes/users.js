import { addUser } from "../controllers/user";

const usersRouter = (router) => {

  router.post('/add', addUser);

  return router;

};

export default usersRouter;