import express from "express";
import session from "cookie-session";

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
import { rowBody, webhookEvents } from "../controllers/payment";

const router = express.Router();

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

const apiRouter = (app, passport, io, redisClient, Webhook) => {
  const sessionMiddleware = session({
    name: "session",
    keys: [SESSION_SECRET_VALUE],
    cookie: {
      secure: true,
      httpOnly: true,
      expires: expirySessionDate,
    },
  });

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
    userSessionRouter(io, redisClient, Webhook)
  );
  router.post('/coinbase/webhook', rowBody, webhookEvents(Webhook));
  router.use(
    "/adminSession",
    passport.authenticationMiddleware,
    checkActivePermission,
    checkAdminPermission,
    adminSessionRouter(io, redisClient)
  );

  return router;
};

export default apiRouter;
