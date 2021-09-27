import paymentQueries from "../models/query/payment";
import peyMethodQueries from "../models/query/peyMethod";
import epayment from "../config/e-payment";

export const rowBody = (req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    next();
  })
  req.on('error', () => {
    console.log("Got error: " + e);
    next();
  })
};

export const webhookEvents = (Webhook) => (req, res) => {
    console.log(req.rawBody)
    const signature = req.headers['x-cc-webhook-signature']
    const sharedSecret = '5168e7c8-fa74-4fcb-8c29-afda754adfdf'
      try {
        const event = Webhook.verifyEventBody(req.rawBody, signature, sharedSecret);
        if (event.type === 'charge:pending') {
          console.log('********************************pending**************************************')
        }
        if (event.type === 'charge:created') {
          console.log('********************************created**************************************')
        }
        res.json({response: event.id})
      } catch (error) {
        console.log('********************************ERROR**************************************')
        res.status(400).send({message: error})
      }
}

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
      return res.status(200).json({ success: true, data: charge });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

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
