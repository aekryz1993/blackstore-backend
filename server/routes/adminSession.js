import express from "express";

import servicesRouter from "./admin/services";
import productCategoryRouter from "./admin/productCategory";
import productIDRouter from "./admin/productID";
import productCodeRouter from "./admin/productCode";
import usersRouter from "./admin/users";

const router = express.Router();

const adminSessionRouter = (io, redisClient) => {
  const treatedCommandNamespace = io.of("/treatedCommands");
  treatedCommandNamespace.on("connection", async (socket) => {
    try {
      socket.on('send_userId', userId => {
        socket.join(userId)
      })
    } catch (error) {
      console.log(error);
    }
  });
  router.use("/users", usersRouter(redisClient));
  router.use("/services", servicesRouter());
  router.use("/productCategory", productCategoryRouter());
  router.use("/productID", productIDRouter());
  router.use("/productCode", productCodeRouter(treatedCommandNamespace, redisClient));

  return router;
};

export default adminSessionRouter;
