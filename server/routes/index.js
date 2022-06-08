import express from "express";
import { createAdmin } from "../db/seed";

import {
  jwtPassportStrategy,
  localPassportStrategy,
} from "../config/passport.config";
import authRouter from "./auth";
import userSessionRouter from "./userSession";
import {
  checkActivePermission,
  checkAdminPermission,
} from "../controllers/middleware/permissions";
import adminSessionRouter from "./adminSession";
// import {
//   binanceWebhookEvents,
//   coinbaseWebhookEvents,
// } from "../controllers/payment";

const router = express.Router();

// const wrap = (middleware) => (socket, next) =>
//   middleware(socket.request, {}, next);

// const apiRouter = (app, passport, io, redisClient, sequelize) => {
const apiRouter = (app, passport, sequelize) => {
  (async () => {
    await sequelize.sync();
    await sequelize.authenticate();
    // createAdmin(redisClient);
    createAdmin();
  })();

  // io.use(wrap(passport.initialize()));

  app.use(passport.initialize());
  localPassportStrategy(passport);
  jwtPassportStrategy(passport);

  router.use("/auth", authRouter(passport));
  router.use(
    "/userSession",
    passport.authenticate("jwt", { session: false }),
    checkActivePermission,
    // userSessionRouter(io, redisClient)
    userSessionRouter()
  );
  router.use(
    "/adminSession",
    passport.authenticate("jwt", { session: false }),
    checkActivePermission,
    checkAdminPermission,
    // adminSessionRouter(io, redisClient)
    adminSessionRouter()
  );
  // router.post("/coinbase/webhook", coinbaseWebhookEvents(io));
  // router.post("/binance/webhook", binanceWebhookEvents(io));
  return router;
};

export default apiRouter;
