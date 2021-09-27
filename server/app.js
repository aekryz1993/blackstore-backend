import express from "express";
import logger from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import path from "path";
import { Server } from "socket.io";
import { Webhook } from "coinbase-commerce-node";

import { SESSION_SECRET, SESSION_SECRET_VALUE } from "./config/passport.config";
import apiRouter from "./routes";
import redisConnect from "./config/redis";
// import epayment from "./config/e-payment";

var router = express.Router();
const app = express();
const CURRENT_WORKING_DIR = process.cwd();
export const redisClient = redisConnect();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  app.use(compression());
}

app.use(helmet());
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(CURRENT_WORKING_DIR, "resources")));
app.use(express.static(path.join(CURRENT_WORKING_DIR, "certificate")));
app.set(SESSION_SECRET, SESSION_SECRET_VALUE);

const io = new Server();
app.io = io;

app.use("/api", apiRouter(app, passport, io, redisClient, Webhook));

app.get("/", function (req, res) {
   res.send('Welcome to Black Store GB.')
});

router.post("/", function (req, res) {
  const signature = req.headers['x-cc-webhook-signature']
  const sharedSecret = '5168e7c8-fa74-4fcb-8c29-afda754adfdf'
  try {
    const event = Webhook.verifyEventBody(JSON.stringify(req.body), signature, sharedSecret);
    if (event.type === 'charge:pending') {
      console.log('********************************PENDING**************************************')
    }
    if (event.type === 'charge:created') {
      console.log('********************************CREATED**************************************')
    }
    res.status(200).json({response: event.id})
  } catch (error) {
    console.log(error.message)
    res.status(400).send({message: error.message})
  }
});

export default app;
