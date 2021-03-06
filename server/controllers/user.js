import fs from "fs";

import imageQueries from "../models/query/image";
import paymentQueries from "../models/query/payment";
import permissionQueires from "../models/query/permission";
import userQueries from "../models/query/user";
import walletQueries from "../models/query/wallet";
import { serverErrorMessage } from "../utils/messages";
import {
  fieldAlreadyExist,
  successRegistrationUser,
  successUpdatedUser,
} from "../utils/messages/user";
import { paginateData } from "./helper";
import { saveUsers } from "./middleware/user";
import permissionQueries from "../models/query/permission";

// export const addUser = (redisClient) => (req, res) => {
export const addUser = () => (req, res) => {
  (async () => {
    const { permissions, ...userBody } = req.body;
    try {
      const { user, isNewUser } = await userQueries.create(userBody);

      const { username, email, phone } = user.dataValues;

      if (!isNewUser) {
        return res.status(409).json(fieldAlreadyExist(username, email, phone));
      }
      // await redisClient.set(user.dataValues.id, "0");
      // const imageBody = {
      //   type: "image/png",
      //   name: `default.png`,
      //   url: null,
      //   UserId: user.dataValues.id,
      // };

      // await imageQueries.create(imageBody);
      await permissionQueires.create({
        ...permissions,
        UserId: user.dataValues.id,
      });
      await walletQueries.create({ UserId: user.dataValues.id });

      const newUser = await userQueries.findById(user.dataValues.id);

      const fullname = await newUser.getFullname();
      newUser.dataValues.fullname = fullname;

      const totalUsers = await userQueries.count(req.user.id)();

      return res
        .status(201)
        .json(successRegistrationUser(newUser.dataValues, totalUsers));
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const updateUser = () => (req, res) => {
  (async () => {
    const body = req.body;
    try {
      await userQueries.update({ body: body.user, id: req.params.id });

      await permissionQueries.update({
        UserId: req.params.id,
        body: body.permissions,
      });

      const user = await userQueries.findById(req.params.id);

      const fullname = await user.getFullname();
      user.dataValues.fullname = fullname;

      return res.status(201).json(successUpdatedUser(user));
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

// export const addMultiUser = (redisClient) => (req, res) => {
export const addMultiUser = () => (req, res) => {
  (async () => {
    const users = req.dataObj;
    try {
      const message = await saveUsers(users);
      return res.status(201).json({ message });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const getAllUsers = () => (req, res) => {
  (async () => {
    try {
      const { page } = req.params;
      const users = [];
      const { offset, limit, totalPages, totalItems, nextPage } =
        await paginateData(page, userQueries.count(req.user.id), 6, false);
      const initAllUsers = await userQueries.findAll(
        limit,
        offset,
        req.user.id
      );
      for (let user of initAllUsers) {
        const fullname = await user.getFullname();
        user = user.dataValues;
        user.fullname = fullname;
        let userInfo = Object.fromEntries(
          Object.entries(user).filter(([key, _]) => key !== "password")
        );
        // userInfo = { ...userInfo, image: user.Image.dataValues.url };
        users.push(userInfo);
      }

      res.status(200).json({
        success: true,
        users,
        totalPages,
        page: nextPage,
        totalUsers: totalItems,
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const updateProfilePicture = (req, res, next) => {
  (async () => {
    try {
      const id = req.params.userId ? req.params.userId : req.user.id;
      const image = await imageQueries.find(id);
      const currentImageUrl = image.dataValues.url;
      await image.destroy();
      if (!currentImageUrl.endsWith("default.png")) {
        fs.unlink(currentImageUrl, (err) => {
          if (err) throw err;
        });
      }
      req.body.associatedModelId = id;
      req.body.associatedModel = "UserId";
      next();
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const confirmPayment = (req, res) => {
  (async () => {
    try {
      const payment = await paymentQueries.updateConfirmed(req.params.id);
      if (!payment) {
        return res
          .status(401)
          .json({ message: "there is not payment with that ID" });
      }

      const UserId = payment.dataValues.UserId;
      const amount = payment.dataValues.amount;

      const wallet = await findWallet(UserId);
      if (!wallet) {
        res.json(401).json({ message: "This wallet doesn't exist" });
      }
      const newCredit = wallet.dataValues.credit + amount;

      await walletQueries.update({ UserId, newCredit });

      return res.status(200).json({ message: "???? ?????????? ?????????????? ??????????" });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
