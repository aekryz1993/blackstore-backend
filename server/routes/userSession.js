import express from "express";

import servicesRouter from "./user/services";
import productCategoryRouter from "./user/productCategory";
import productIDRouter from "./user/productID";
import walletRouter from "./user/wallet";
import productCodeRouter from "./user/productCode";
import { checkSession, logout, getToken } from "../controllers/auth";
import uploadImage from "../controllers/middleware/image";
import { updateProfilePicture } from "../controllers/user";
import { addPicture } from "../controllers/image";
// import userQueries from "../models/query/user";
import {
  getNotifications,
  resetNotificationsCount,
} from "../controllers/notification";
import paymentRouter from "./user/payment";

const router = express.Router();

// const userSessionRouter = (io, redisClient) => {
const userSessionRouter = () => {
  // const orderCommandNamespace = io.of("/orderCommands");
  // orderCommandNamespace.on("connection", async (socket) => {
  //   try {
  //     const admins = await userQueries.findAdmins();
  //     admins.forEach((admin) => socket.join(admin.dataValues.id));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  router.use("/services", servicesRouter());
  router.use("/wallet", walletRouter());
  router.use("/productCategory", productCategoryRouter());
  router.use("/productID", productIDRouter());
  router.use("/payment", paymentRouter());
  router.use(
    "/productCode",
    // productCodeRouter(orderCommandNamespace, redisClient)
    productCodeRouter()
  );
  router.put(
    "/updateProfilePicture",
    uploadImage.single("picture"),
    updateProfilePicture,
    addPicture
  );
  router.get("/getNotifications", getNotifications());
  router.put("/resetNotificationsCount", resetNotificationsCount());
  // router.get("/getNotifications", getNotifications(redisClient));
  // router.put("/resetNotificationsCount", resetNotificationsCount(redisClient));
  router.get("/logout", logout);
  router.get("/session", checkSession);

  return router;
};

export default userSessionRouter;
