import { findPayment } from "../models/query/payment";
import { createPayMethod } from "../models/query/peyMethod";

export const buyingCredit = (req, res) => {
  (async () => {
    const { amount, codeID } = req.body;
    try {
      const existPayment = await findPayment(codeID);

      if (existPayment) {
        return res
          .status(401)
          .json({ message: "هذه العملية تم إجراءها مسبقا" });
      }

      UserId = req.user.id;

      await createPayment({ amount, codeID, UserID });

      return res.status(201).json({
        message:
          "تم إجراء عملية الدفع بنجاح يرجى انتظار التأكيد من طرف مدير التطبيق",
        payment: {
          amount,
          codeID,
          user: req.user.username,
        },
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const fetchNotConfirmedPayments = (req, res) => {
  (async () => {
    try {
      let payments = await getNotConfirmedPayments();

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
      const { payMethod, created } = await createPayMethod(req.body);

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
      const payMethod = await findPayMethod(req.body);

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