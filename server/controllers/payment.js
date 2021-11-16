import paymentQueries from "../models/query/payment";
import peyMethodQueries from "../models/query/peyMethod";
import walletQueries from "../models/query/wallet";
import { coinBaseConfig, binanceConfig } from "../config/e-payment";
import { Webhook } from "coinbase-commerce-node";
import { v4 as uuid } from "uuid";
import { serverErrorMessage } from "../utils/messages";
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

      // const charge = {
      //   id: chargeId,
      //   status,
      //   amount,
      // };

      // const coinbaseWebHooksNamespace = io.of("/coinbaseWebHooksNamespace");

      // if (status.toLowerCase() === "new") {
      //   coinbaseWebHooksNamespace.on("connection", async (socket) => {
      //     try {
      //       socket.join(userId);
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   });
      //   coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      // } else 
      if (status.toLowerCase() === "completed") {
        const wallet = await walletQueries.find(userId);
        const newCredit = wallet.dataValues.dollar + parseFloat(amount);
        await walletQueries.update({
          UserId: userId,
          newCredit,
          currency: "dollar",
        });
        await paymentQueries.updateStatus({orderId: id, status, confirmed: true});
        // coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      } else {
        await paymentQueries.updateStatus({orderId: id, status, confirmed: false});
        // coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", charge);
      }

      return res.status(200).json({ message: "Notification has been occurred" });
    } catch (error) {
      return res.status(400).send({ message: error });
    }
  })();
};

// -- Coinbase ------------------------- Create a Charge -------------------------------------
export const buyingCreditCoinbase = (req, res) => {
  (async () => {
    try {
      const { amount } = req.body;
      const { id } = req.user;
      const { Charge } = coinBaseConfig().resources;
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
      const charge = await Charge.create(chargeData);

      const orderBody = {
        UserId: id,
        orderId: charge.id,
        peyMethod: "coinbase",
        currency: 'USD',
        status: 'NEW',
        amount,
        checkoutUrl: charge.hosted_url,
      };
      await paymentQueries.create(orderBody);

      return res.status(200).json({ success: true, order: orderBody });
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
      const merchantTradeNo = uuid().split("-").join("");

      const body = {
        merchantTradeNo,
        tradeType: "WEB",
        totalFee: amount,
        currency: "USDT",
        productType: "CREDIT",
        productName: "USD",
      };

      const config = binanceConfig({ body });

      const response = await axios.post(
        config.orderUrl,
        JSON.stringify(body),
        config.requestOptions
      );

      const orderBody = {
        UserId: id,
        orderId: merchantTradeNo,
        peyMethod: "binance",
        currency: 'USD',
        status: 'NEW',
        amount,
        checkoutUrl: response.data.checkoutUrl,
      };
      await paymentQueries.create(orderBody);
      return res.status(200).json({ success: true, order: orderBody });
    } catch (err) {
      return res.json(serverErrorMessage(err));
    }
  })();
};

// -- Binance ------------------------- Webhook Events -------------------------------------
export const binanceWebhookEvents = (io) => (req, res) => {
  (async () => {
    try {
      const { data, bizStatus } = req.body;
      const { merchantTradeNo, totalFee } = data;
      const payment = await paymentQueries.find(merchantTradeNo);
      const userId = payment.dataValues.UserId;
      if (bizStatus === "PAY_SUCCESS") {
        const wallet = await walletQueries.find(userId);
        const newCredit = wallet.dataValues.dollar + parseFloat(totalFee);
        await walletQueries.update({
          UserId: userId,
          newCredit,
          currency: "dollar",
        });
        await paymentQueries.updateStatus({orderId: merchantTradeNo, status: bizStatus, confirmed: true});
        // coinbaseWebHooksNamespace.to(userId).emit("webhooks_status", req.body);
      }
      return res.status(200).json({ message: "Notification has been occurred" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: error });
    }
  })();
};

// --------------------------- Get Payments -------------------------------------
export const fetchPayments = (req, res) => {
  (async () => {
    const { id: UserId } = req.user;
    const { currency } = req.params;

    try {
      const payments = await paymentQueries.findByUserAndCurrency({
        currency,
        UserId,
      });

      return res.json({ payments, success: true });
    } catch (error) {
      return res.status(400).send({ message: error });
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
