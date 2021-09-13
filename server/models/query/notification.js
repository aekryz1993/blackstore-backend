import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notification = await models.Notification.create(body);
      resolve(notification);
    } catch (err) {
      reject(err);
    }
  });
};

const findByUser = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await models.Notification.findAll({
        where: {UserId},
        orders: ['createdAt', 'DESC']
      });
      resolve({notifications});
    } catch (err) {
      reject(err);
    }
  });
};

export default {
    create,
    findByUser,
}