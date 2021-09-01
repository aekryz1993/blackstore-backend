import { countCommands, findCommandsByUser } from "../models/query/command";
import { countUsers, findAllUsersWithCmnds } from "../models/query/user";
import { serverErrorMessage } from "../utils/messages";
import { paginateData } from "./helper";

export const getCommands = (req, res) => {
  (async () => {
    try {
      const { page, isTreated } = req.params;
      const users = [];
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, countUsers, 6, false);

      const initAllUsers = await findAllUsersWithCmnds(limit, offset, isTreated);
      for (let user of initAllUsers) {
        user = user.dataValues;
        let userInfo = Object.fromEntries(
          Object.entries(user).filter(([key, _]) => key !== "password" && key !== "Image")
        );
        userInfo = {
          ...userInfo,
          image: user.Image.dataValues.url,
          commands: user.Command,
        };
        users.push(userInfo);
      }

      res.status(200).json({
        users,
        totalPages,
        nextPage,
        totalUsers: totalItems,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getCommandsByUser = (req, res) => {
  (async () => {
    const currentUserId = req.user.id;
    const { page, isTreated } = req.params;
    try {
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, countCommands, 7, false, {
          userId: currentUserId,
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
