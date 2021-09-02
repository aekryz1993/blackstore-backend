import {
  countCommands,
  findCommands,
  findCommandsByUser,
} from "../models/query/command";
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
        user = Object.fromEntries(
          Object.entries(user.dataValues).filter(
            ([key, _]) =>
              key !== "password" &&
              key !== "id" &&
              key !== "isVerified" &&
              key !== "isActive" &&
              key !== "isAdmin" &&
              key !== "createdAt" &&
              key !== "updatedAt"
          )
        );
        command.dataValues.user = user;
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
