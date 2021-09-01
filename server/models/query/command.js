import models from "../associations";

export const createCommand = ({ category, quantity, UserId, serviceName }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = await models.Command.create({
        category,
        quantity,
        serviceName,
        UserId,
      });
      resolve(command);
    } catch (err) {
      reject(err);
    }
  });
};

export const findCommandsByUser = (userId, limit, offset, isTreated) => {
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

export const findCommands = (limit, offset, isTreated) => {
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

export const countCommands = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalCommands = await models.Command.count({
        where: {...props},
      });
      resolve(totalCommands);
    } catch (err) {
      reject(err);
    }
  });
};
