import models from "../associations";

export const createCommand = ({ category, quantity, UserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = await models.Command.create({
        category,
        quantity,
        UserId,
      });
      resolve(command);
    } catch (err) {
      reject(err);
    }
  });
};

export const findCommandsByUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commands = await models.Command.findAll({
        where: {
          UserId: userId,
        },
      });
      resolve(commands);
    } catch (err) {
      reject(err);
    }
  });
};
