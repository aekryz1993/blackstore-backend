import models from "../associations";

export const createCommand = ({ category, quantity, UserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [command, created] = await models.Command.findOrCreate({
        where: { category },
        default: { category },
      });
      if (created) {
        await models.Command.update({UserId}, {
            where: {id: command.id}
        });
      }
      await models.Command.update(
        { quantity: command.quantity + quantity },
        {
          where: { category },
        }
      );
      resolve(command);
    } catch (err) {
      reject(err);
    }
  });
};
