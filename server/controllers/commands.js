import commandQueries from "../models/query/command";
// import notificationQueries from "../models/query/notification";
import productCodeQueries from "../models/query/productCode";
import userQueries from "../models/query/user";
import { serverErrorMessage } from "../utils/messages";
import { paginateData } from "./helper";

export const getCommandsByUser = (req, res) => {
  (async () => {
    const currentUserId = req.user.id;
    const { page, isTreated } = req.params;
    try {
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, commandQueries.count, 15, true, {
          UserId: currentUserId,
          isTreated,
        });
      const commands = await commandQueries.findByUser(
        currentUserId,
        limit,
        offset,
        isTreated
      );
      return res.status(200).json({
        commands,
        totalItems,
        nextPage,
        totalPages,
        success: true,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getCommands = (req, res) => {
  (async () => {
    const { page, isTreated } = req.params;
    try {
      let commands = [];
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, commandQueries.count, 15, true, {
          isTreated,
        });
      const initiaCommands = await commandQueries.findIsTreated(
        limit,
        offset,
        isTreated
      );
      for (let command of initiaCommands) {
        let user = await userQueries.findById(command.dataValues.UserId);
        user = user.dataValues;
        command.dataValues.user = `${user.firstname} ${user.lastname}`;
        command.dataValues.email = user.email;
        command.dataValues.phone = user.phone;
        commands = [...commands, command];
      }
      return res.status(200).json({
        commands,
        totalItems,
        nextPage,
        totalPages,
        success: true,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

// export const treatCommand = (io, redisClient) => (req, res, next) => {
export const treatCommand = () => (req, res, next) => {
  (async () => {
    const { userId, commandId, categoryId } = req.params;
    const codes = req.dataObj;
    try {
      if (!codes) {
        return res.status(400).json({ message: "You should upload a file" });
      }
      for (let i in codes) {
        await productCodeQueries.create({
          code: String(codes[i]["PIN/Code"]),
          Serial: String(codes[i]["Serial"]),
          Date: String(codes[i]["Date"]),
          sold: true,
          ProductCategoryId: categoryId,
          UserId: userId,
          CommandId: commandId,
        });
      }
      await commandQueries.updateIsTreated(commandId);
      // const notification = await notificationQueries.create({
      //   action: "command has been sent",
      //   UserId: userId,
      //   CommandId: commandId,
      // });
      // const notifyCount = await redisClient.get(userId);
      // await redisClient.set(
      //   userId,
      //   (parseInt(notifyCount) + 1).toString()
      // );
      // io.to(userId).emit("send_command", {
      //   notification,
      //   from: `${req.user.firstname} ${req.user.lastname}`,
      //   // product: label,
      //   // quantity: newCommand.dataValues.quantity,
      //   // date: newCommand.dataValues.createdAt,
      // });
      return res
        .status(201)
        .json({ success: true, message: "Command has been successfully sent" });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
