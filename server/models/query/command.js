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

export const findCommandsByUser = (userId, limit, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commandsTreated = await models.Command.findAll({
        offset,
        limit,
        where: {
          UserId: userId,
          isTreated: true,
        },
      });
      const commandsWaiting = await models.Command.findAll({
        offset,
        limit,
        where: {
          UserId: userId,
          isTreated: false,
        },
      });
      resolve({commandsTreated, commandsWaiting});
    } catch (err) {
      reject(err);
    }
  });
};

export const countCommands = ({userId, isTreated}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalCommands = await models.Command.count({
              where: {
                UserId: userId,
                isTreated,
              },
            })
            resolve(totalCommands)
        } catch (err) {
            reject(err)
        }
    })
}
