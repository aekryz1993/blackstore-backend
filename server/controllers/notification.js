import notificationQueries from "../models/query/notification";
import { serverErrorMessage } from "../utils/messages";

export const getNotifications = (redisClient) => (req, res) => {
  (async () => {
    try {
      const userId = req.user.id;
      const notificationCount = await redisClient.get(userId);
      const initNotifications = await notificationQueries.findByUser(userId);
      const notifications = initNotifications.length
        ? initNotifications.map((product) =>
            Object.fromEntries(
              Object.entries(notification).filter(
                ([key, _]) => key === "dataValues"
              )
            )
          )
        : [];
      res.status(200).json({
        notificationCount: parseInt(notificationCount),
        notifications,
        success: true,
      });
    } catch (error) {
      return res.json(serverErrorMessage(error.message));
    }
  })();
};

export const resetNotificationsCount = (redisClient) => (req, res) => {
  (async () => {
    try {
      const userId = req.user.id;
      await redisClient.set(userId, "0");
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.json(serverErrorMessage(error.message));
    }
  })();
};
