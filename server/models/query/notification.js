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

const findByUser = (UserId, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await models.Notification.findAll({
        limit,
        where: {UserId},
        include: [models.User, models.Command],
      });
      resolve(notifications);
    } catch (err) {
      reject(err);
    }
  });
};

const count = (UserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const numberOfNotifications = await models.Notification.count({
        where: { UserId },
      });
      resolve(numberOfNotifications);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
    create,
    findByUser,
    count,
}