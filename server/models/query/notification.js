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

export default {
    create
}