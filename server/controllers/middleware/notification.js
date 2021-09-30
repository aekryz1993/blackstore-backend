import notificationQueries from "../../models/query/notification";

export const addNotification = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notification = await notificationQueries.create(body);
      resolve(notification);
    } catch (err) {
      reject(err.message);
    }
  });
};
