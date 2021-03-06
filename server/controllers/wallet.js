import walletQueries from "../models/query/wallet";
import { serverErrorMessage } from "../utils/messages";

export const addWallet = (req, res, next) => {
  (async () => {
    try {
      let { dollar, euro, dinnar, associatedModelId, associatedModel } =
        req.body;
      dollar = dollar ? dollar : 0.0;
      euro = euro ? euro : 0.0;
      dinnar = dinnar ? dinnar : 0.0;
      await walletQueries.create({
        dollar,
        euro,
        dinnar,
        [associatedModel]: associatedModelId,
      });
      next();
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const updateCredit = (req, res) => {
  (async () => {
    try {
      let { dollar, euro, dinnar } = req.body;
      dollar = dollar ? dollar : 0.0;
      euro = euro ? euro : 0.0;
      dinnar = dinnar ? dinnar : 0.0;
      const UserId = req.params.userId;
      await walletQueries.updateAll({ UserId, dollar, euro, dinnar });
      return res
        .status(200)
        .json({ message: "تم تحديث المحفظة بنجاح", success: true });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const fetchCurrentCredit = (req, res) => {
  (async () => {
    try {
      const { id } = req.user.dataValues;

      const wallet = await walletQueries.find(id);
      if (!wallet) {
        res.status(401).json({ message: "This wallet doesn't exist" });
      }
      const { dollar, euro, dinnar } = wallet.dataValues;
      return res.status(200).json({ dollar, euro, dinnar });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
