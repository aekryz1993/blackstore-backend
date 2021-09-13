import notificationQueries from "../../models/query/notification";
import { serverErrorMessage } from "../../utils/messages";

export const addNotification = ({ UserId, CommandId, action }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notification = await notificationQueries.create({
        action,
        UserId,
        CommandId,
      });
      resolve(notification);
    } catch (err) {
      reject(err.message);
    }
  });
};
