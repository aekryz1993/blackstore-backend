import express from "express";
import logger from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import path from "path";
import { Server } from "socket.io";
// import { Webhook } from "coinbase-commerce-node";

import { SESSION_SECRET, SESSION_SECRET_VALUE } from "./config/passport.config";
import apiRouter from "./routes";
import redisConnect from "./config/redis";
// import epayment from "./config/e-payment";

const app = express();
const CURRENT_WORKING_DIR = process.cwd();
export const redisClient = redisConnect();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  app.use(compression());
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(CURRENT_WORKING_DIR, "resources")));
app.set(SESSION_SECRET, SESSION_SECRET_VALUE);

const io = new Server();
app.io = io;

app.use("/api", apiRouter(app, passport, io, redisClient));
app.get("/", function (req, res) {
  // const { Event } = epayment().coinbaseResources;
  // const signature = req.headers['x-cc-webhook-signature']
  // const sharedSecret = '5168e7c8-fa74-4fcb-8c29-afda754adfdf'
  // const event = Webhook.verifySigHeader(req.rawBody, signature, sharedSecret);
  // if (event.type === 'charge:confirmed') {
  //   console.log(event.type)
  // }
  res.json({response: 'event.id'})
});

export default app;
