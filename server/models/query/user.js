import { Op } from "sequelize";

import models from "../associations";

const create = (body) => {
  const { username, email, phone } = body;

  return new Promise(async (resolve, reject) => {
    try {
      const [user, isNewUser] = await models.User.findOrCreate({
        where: {
          [Op.or]: [{ username: username }, { email: email }, { phone: phone }],
        },
        defaults: body,
      });

      resolve({ user, isNewUser });
    } catch (err) {
      reject(err);
    }
  });
};

const update = ({ body, id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await models.User.update(body, {
        where: {
          id,
        },
      });

      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

const find = (userIdentifier) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await models.User.findOne({
        where: {
          [Op.or]: [
            { username: userIdentifier },
            { email: userIdentifier },
            { phone: userIdentifier },
          ],
        },
      });
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

const findById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await models.User.findByPk(id);
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

const count = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await models.User.count({
        where: { isAdmin: false },
      });
      resolve(allUsers);
    } catch (err) {
      reject(err);
    }
  });
};

const findAll = (limit, offset, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await models.User.findAll({
        offset,
        limit,
        where: { id: { [Op.not]: id } },
        include: [models.Image],
      });
      resolve(allUsers);
    } catch (err) {
      reject(err);
    }
  });
};

const findActive = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await models.User.findAll({
        where: {
          [Op.and]: [{ isAdmin: false }, { isActive: true }],
        },
      });
      resolve(allUsers);
    } catch (err) {
      reject(err);
    }
  });
};

const findNotActive = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await models.User.findAll({
        where: {
          [Op.and]: [{ isAdmin: false }, { isActive: false }],
        },
      });
      resolve(allUsers);
    } catch (err) {
      reject(err);
    }
  });
};

const findAdmins = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await models.User.findAll({
        where: {
          [Op.and]: [{ isAdmin: true }, { isActive: true }],
        },
      });
      resolve(allUsers);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  update,
  find,
  findById,
  count,
  findAll,
  findActive,
  findNotActive,
  findAdmins,
};
