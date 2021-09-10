import models from "../associations";

const create = ({
  category,
  quantity,
  UserId,
  serviceName,
  ProductCategoryId,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = await models.Command.create({
        category,
        quantity,
        serviceName,
        UserId,
        ProductCategoryId,
      });
      resolve(command);
    } catch (err) {
      reject(err);
    }
  });
};

const findByUser = (userId, limit, offset, isTreated) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commands = await models.Command.findAll({
        offset,
        limit,
        where: {
          UserId: userId,
          isTreated,
        },
      });
      resolve(commands);
    } catch (err) {
      reject(err);
    }
  });
};

const findIsTreated = (limit, offset, isTreated) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commands = await models.Command.findAll({
        offset,
        limit,
        where: {
          isTreated,
        },
      });
      resolve(commands);
    } catch (err) {
      reject(err);
    }
  });
};

const count = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalCommands = await models.Command.count({
        where: { ...props },
      });
      resolve(totalCommands);
    } catch (err) {
      reject(err);
    }
  });
};

const updateIsTreated = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = await models.Command.update(
        { isTreated: true },
        {
          where: { id },
        }
      );
      resolve(command);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  findByUser,
  findIsTreated,
  count,
  updateIsTreated,
};
