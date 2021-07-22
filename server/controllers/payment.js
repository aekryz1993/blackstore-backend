import { findPayment } from "../models/query/payment";

export const buyingCredit = (req, res) => {
  (async () => {
    const { amount, codeID } = req.body;
    try {
      const existPayment = await findPayment(codeID);

      if (existPayment) {
        return res
          .status(401)
          .json({ message: "هذه العملية تم إجراءها ميبقا" });
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
