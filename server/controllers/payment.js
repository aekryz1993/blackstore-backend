import paymentQueries from "../models/query/payment";
import peyMethodQueries from "../models/query/peyMethod";

import epayment from '../config/e-payment'

export const buyingCreditCoinbase = (req, res) => {
  (async () => {
    const { amount } = req.params;
    const { id } = req.user;
    const {Charge} = epayment().coinbaseResources;
    try {
      // const existPayment = await paymentQueries.find(codeID);

      // if (existPayment) {
      //   return res
      //     .status(401)
      //     .json({ message: "هذه العملية تم إجراءها مسبقا" });
      // }

      // UserId = req.user.id;

      // await paymentQueries.create({ amount, codeID, UserID });

      // return res.status(201).json({
      //   message:
      //     "تم إجراء عملية الدفع بنجاح يرجى انتظار التأكيد من طرف مدير التطبيق",
      //   payment: {
      //     amount,
      //     codeID,
      //     user: req.user.username,
      //   },
      // });
      return res.status(200).json({id, amount})
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
