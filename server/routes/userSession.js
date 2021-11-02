import express from "express";

import servicesRouter from "./user/services";
import productCategoryRouter from "./user/productCategory";
import productIDRouter from "./user/productID";
import walletRouter from "./user/wallet";
import productCodeRouter from "./user/productCode";
import { logout } from "../controllers/auth";
import uploadImage from "../controllers/middleware/image";
import { updateProfilePicture } from "../controllers/user";
import { addPicture } from "../controllers/image";
import { buyingCreditBinance, buyingCreditCoinbase } from "../controllers/payment";
import userQueries from "../models/query/user";
import {
  getNotifications,
  resetNotificationsCount,
} from "../controllers/notification";

const router = express.Router();

const userSessionRouter = (io, redisClient) => {
  const orderCommandNamespace = io.of("/orderCommands");
  orderCommandNamespace.on("connection", async (socket) => {
    try {
      const admins = await userQueries.findAdmins();
      admins.forEach((admin) => socket.join(admin.dataValues.id));
    } catch (error) {
      console.log(error);
    }
  });
  router.use("/services", servicesRouter());
  router.use("/wallet", walletRouter());
  router.use("/productCategory", productCategoryRouter());
  router.use("/productID", productIDRouter());
  router.use(
    "/productCode",
    productCodeRouter(orderCommandNamespace, redisClient)
  );
  router.post("/payment/coinbase/:amount", buyingCreditCoinbase);
  router.post("/payment/binance", buyingCreditBinance);
  router.put(
    "/updateProfilePicture",
    uploadImage.single("picture"),
    updateProfilePicture,
    addPicture
  );
  router.get("/getNotifications", getNotifications(redisClient));
  router.put("/resetNotificationsCount", resetNotificationsCount(redisClient));
  router.get("/logout", logout);

  return router;
};

export default userSessionRouter;
