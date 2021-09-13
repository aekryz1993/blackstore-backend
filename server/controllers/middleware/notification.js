import notificationQueries from "../../models/query/notification";
import { serverErrorMessage } from "../../utils/messages";

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
