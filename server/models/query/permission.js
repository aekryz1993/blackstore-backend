import models from "../associations";

const find = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const permission = await models.Permission.findOne({
        where: { UserId },
      });
      resolve(permission);
    } catch (err) {
      reject(err);
    }
  });
};

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.Permission.create(body);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  find,
  create,
};
