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

app.use("/api", apiRouter(app, passport, io, redisClient));

const charge = {"data":{"addresses":{"ethereum":"0x3868887510d1d9c3ae205c6034dfa017a28b6c00","usdc":"0x3868887510d1d9c3ae205c6034dfa017a28b6c00","dai":"0x3868887510d1d9c3ae205c6034dfa017a28b6c00","bitcoincash":"qzhw7d5srx2tsz5rjw5zcsy4prmpkepk0suufjgfkx","dogecoin":"DNDqwt7JHgayuSKtNRbYwmwErjpLNR8wBh","litecoin":"MMW9yFUbSsxfmWPywHpLBY2e1mKP7VnEjs","bitcoin":"36or3wDsUmahgaspJLu7H74d6VDCRQYaQ9"},"code":"E7ZCFX5A","created_at":"2021-09-27T10:03:49Z","description":"Mastering the Transition to the Information Age","exchange_rates":{"BCH-USD":"502.19","BTC-USD":"43574.28","DAI-USD":"1.000369","ETH-USD":"3091.165","LTC-USD":"151.57","DOGE-USD":"0.20455","USDC-USD":"1.0"},"expires_at":"2021-09-27T11:03:49Z","hosted_url":"https://commerce.coinbase.com/charges/E7ZCFX5A","id":"89f7565c-830f-435c-899f-95b0b137dfcc","local_exchange_rates":{"BCH-USD":"502.19","BTC-USD":"43574.28","DAI-USD":"1.000369","ETH-USD":"3091.165","LTC-USD":"151.57","DOGE-USD":"0.20455","USDC-USD":"1.0"},"name":"The Sovereign Individual","organization_name":"blue store","payments":[],"pricing":{"local":{"amount":"100.00","currency":"USD"},"ethereum":{"amount":"0.032350000","currency":"ETH"},"usdc":{"amount":"100.000000","currency":"USDC"},"dai":{"amount":"99.963113611077512398","currency":"DAI"},"bitcoincash":{"amount":"0.19912782","currency":"BCH"},"dogecoin":{"amount":"488.87802490","currency":"DOGE"},"litecoin":{"amount":"0.65976117","currency":"LTC"},"bitcoin":{"amount":"0.00229493","currency":"BTC"}},"pricing_type":"fixed_price","pwcb_only":false,"resource":"charge","support_email":"aekrizi@gmail.com","timeline":[{"status":"NEW","time":"2021-09-27T10:03:49Z"}]}}

app.get("/", function (req, res) {
  // const { Event } = epayment().coinbaseResources;
  // const signature = req.headers['x-cc-webhook-signature']
  // const sharedSecret = '5168e7c8-fa74-4fcb-8c29-afda754adfdf'
  // const event = Webhook.verifySigHeader(req.rawBody, signature, sharedSecret);
  // if (event.type === 'charge:confirmed') {
  //   console.log(event.type)
  // }
  console.log(charge)
  res.send('Welcome to Black Store GB.')
});


app.post("/", function (req, res) {
  // const rawBody = charge;
  const signature = req.headers['x-cc-webhook-signature']
  const sharedSecret = '5168e7c8-fa74-4fcb-8c29-afda754adfdf'
  try {
    const event = Webhook.verifyEventBody(charge, signature, sharedSecret);
    if (event.type === 'charge:pending') {
      console.log('********************************pending**************************************')
    }
    res.json({response: event.id})
  } catch (error) {
    res.status(400).send({message: error})
  }
});

export default app;
