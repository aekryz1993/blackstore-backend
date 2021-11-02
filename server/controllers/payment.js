import paymentQueries from "../models/query/payment";
import peyMethodQueries from "../models/query/peyMethod";
import walletQueries from "../models/query/wallet";
import epayment from "../config/e-payment";
import { Webhook } from "coinbase-commerce-node";
import { v4 as uuid } from "uuid";
import libTypedarrays from "crypto-js/lib-typedarrays";
import hmacSHA512 from "crypto-js/hmac-sha512";
import { serverErrorMessage } from "../utils/messages";
import fetch from "node-fetch";
import axios from "axios";

// -- Coinbase ------------------------- Webhook Events -------------------------------------
export const coinbaseWebhookEvents = (io) => (req, res) => {
  (async () => {
    const signature = req.headers["x-cc-webhook-signature"];
    const sharedSecret = process.env.SHAREDSECRET;
    try {
      const event = Webhook.verifyEventBody(
        JSON.stringify(req.body),
        signature,
        sharedSecret
      );

      const userId = event.data.metadata.customer_id;
      const amount = event.data.pricing.local.amount;
      const status = event.data.timeline[event.data.timeline.length - 1].status;
      const chargeId = event.data.id;

      const charge = {
        id: chargeId,
        status,
        amount,
      };

      const coinbaseWebHooksNamespace = io.of("/coinbaseWebHooksNamespace");

      if (status.toLowerCase() === "new") {
        coinbaseWebHooksNamespace.on("connection", async (socket) => {
          try {
            socket.join(userId);
          } catch (error) {
            console.log(error);
          }
        });
        coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      } else if (status.toLowerCase() === "completed") {
        const wallet = await walletQueries.find(userId);
        const newCredit = wallet.dataValues.dollar + parseFloat(amount);
        await walletQueries.update({
          UserId: userId,
          newCredit,
          currency: "dollar",
        });
        coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      } else {
        coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      }
      return res.json({ response: event.id });
    } catch (error) {
      console.log(
        "********************************ERROR**************************************"
      );
      console.log(error);
      return res.status(400).send({ message: error });
    }
  })();
};

// -- Coinbase ------------------------- Fetch Charges -------------------------------------
export const fetchCoinbaseCharges = (req, res) => {
  (async () => {
    let chargesStatus = [];
    const { userId } = req.params;
    let charges = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
    });
    charges = charges.data.filter(
      (charge) => charge.metadata.customer_id === userId
    );
    for (let charge of charges.data) {
      const status = charge.timeline[charge.timeline.length - 1].status;
      const amount = parseFloat(charge.pricing.local.amount);
      const id = parseFloat(charge.id);
      chargesStatus.push({ id, status, amount });
    }
    return res.json({ data: chargesStatus, success: true });
  })();
};

// -- Coinbase ------------------------- Create a Charge -------------------------------------
export const buyingCreditCoinbase = (req, res) => {
  (async () => {
    const { amount } = req.params;
    const { id } = req.user;
    const { Charge } = epayment().resources;
    const chargeData = {
      name: "USD Wallet",
      description: "Fill USD Wallet",
      local_price: {
        amount,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        customer_id: id,
      },
    };
    try {
      const charge = await Charge.create(chargeData);
      return res.status(200).json({ success: true, charge });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

// -- Binance ------------------------- Create an Order -------------------------------------
export const buyingCreditBinance = (req, res) => {
  (async () => {
    try {
      const { amount } = req.body;
      const { id } = req.user;
      const { BINANCE_API_KEY, BINANCE_SECRET_KEY } = process.env;
      const timestamp = Date.now();
      const merchantTradeNo = uuid();
      const nonce = libTypedarrays.random(128 / 8).toString();

      const body = {
        merchantTradeNo,
        tradeType: "WEB",
        totalFee: amount,
        currency: "USDT",
        productType: "CREDIT",
        productName: "USD",
      };

      const payload_to_sign = timestamp + "\n" + nonce + "\n" + body + "\n";
      const signature = hmacSHA512(payload_to_sign, BINANCE_SECRET_KEY)
        .toString()
        .toUpperCase();console.log(JSON.stringify(body))

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "BinancePay-Timestamp": timestamp,
          "BinancePay-Nonce": nonce,
          "BinancePay-Certificate-SN": BINANCE_API_KEY,
          "BinancePay-Signature": signature,
        },
        body: JSON.stringify(body),
        url: "https://bpay.binanceapi.com/binancepay/openapi/order"
      };

      const response = await axios(
        // "https://bpay.binanceapi.com/binancepay/openapi/order",
        requestOptions
      );console.log(response)

      const order = response

      return res.status(200).json({ success: true, order });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

// ----------------------------------------------------------------------------------------------------------------
export const fetchNotConfirmedPayments = (req, res) => {
  (async () => {
    try {
      let payments = await paymentQueries.getNotConfirmed();

      payments = payments.map((payment) =>
        Object.fromEntries(
          Object.entries(payment).filter(
            ([key, _]) => key !== "id" && key !== "confirmed"
          )
        )
      );

      return res.status(201).json({
        payments,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const addPayMethod = (req, res) => {
  (async () => {
    try {
      const { payMethod, created } = await peyMethodQueries.create(req.body);

      if (!created) {
        return res
          .status(401)
          .json({ message: "هذه الطريقة تم إضافتها مسبقا" });
      }

      return res.status(201).json({
        message: "تم إضافة طريقة الدفع بنجاح",
        payMethod,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const fetchPayMethodAddress = (req, res) => {
  (async () => {
    try {
      const payMethod = await peyMethodQueries.find(req.body);

      if (!payMethod) {
        return res.status(401).json({ message: "does not exist" });
      }

      return res.status(201).json({
        message: "Done!",
        address: payMethod.dataValues.address,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
