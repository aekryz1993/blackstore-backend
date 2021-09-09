import {
  countCommands,
  findCommands,
  findCommandsByUser,
  updateCommandStatus,
} from "../models/query/command";
import { createProductCode } from "../models/query/productCode";
import { findUserById } from "../models/query/user";
import { serverErrorMessage } from "../utils/messages";
import { paginateData } from "./helper";

export const getCommandsByUser = (req, res) => {
  (async () => {
    const currentUserId = req.user.id;
    const { page, isTreated } = req.params;
    try {
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, countCommands, 7, false, {
          UserId: currentUserId,
          isTreated,
        });
      const commands = await findCommandsByUser(
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
        await paginateData(page, countCommands, 7, false, {
          isTreated,
        });
      const initiaCommands = await findCommands(limit, offset, isTreated);
      for (let command of initiaCommands) {
        let user = await findUserById(command.dataValues.UserId);
        user = user.dataValues
        command.dataValues.user = `${user.firstname} ${user.lastname}`;
        command.dataValues.email = user.email;
        command.dataValues.phone = user.phone;
        commands = [...commands, command]
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

export const createCodesFromCommand = (io) => (req, res, next) => {
  (async () => {
    const { userId, commandId, categoryId } = req.params;
    const codes = req.dataObj;
    try {
      if (!codes) {
        return res.status(400).json({ message: "You should upload a file" });
      }
      for (let i in codes) {
        await createProductCode({
          code: String(codes[i]["PIN/Code"]),
          Serial: String(codes[i]["Serial"]),
          Date: String(codes[i]["Date"]),
          sold: true,
          ProductCategoryId: categoryId,
          UserId: userId,
          CommandId: commandId,
        });
      }
      const command = await updateCommandStatus(commandId)
      io.to(userId).emit('send_command', command)
      return res.status(201).json({success: true, message: 'Command has been successfully sent'});
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
