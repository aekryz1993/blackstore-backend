import express from "express";
import session from "cookie-session";
import { createAdmin } from "../db/seed";

import {
  localPassportStrategy,
  SESSION_SECRET_VALUE,
  expirySessionDate,
} from "../config/passport.config";
import authRouter from "./auth";
import userSessionRouter from "./userSession";
import {
  checkActivePermission,
  checkAdminPermission,
} from "../controllers/middleware/permissions";
import adminSessionRouter from "./adminSession";
import { webhookEvents } from "../controllers/payment";
//import SequelizeAdapter from "socket.io-adapter-sequelize";

const router = express.Router();

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

const apiRouter = (app, passport, io, redisClient, sequelize) => {
  const sessionMiddleware = session({
    name: "session",
    keys: [SESSION_SECRET_VALUE],
    cookie: {
      secure: true,
      httpOnly: true,
      expires: expirySessionDate,
    },
  });
  (async () => {
    await sequelize.sync();
    await sequelize.authenticate();
    //io.adapter(SequelizeAdapter(sequelize));
    createAdmin(redisClient);
  })()

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  localPassportStrategy(passport);

  // ensureSocketAuthorized(io)

  router.use("/auth", authRouter(passport));
  router.use(
    "/userSession",
    passport.authenticationMiddleware,
    checkActivePermission,
    userSessionRouter(io, redisClient)
  );
  router.use(
    "/adminSession",
    passport.authenticationMiddleware,
    checkActivePermission,
    checkAdminPermission,
    adminSessionRouter(io, redisClient)
  );
  router.post('/coinbase/webhook', webhookEvents(io));
  return router;
};

export default apiRouter;

