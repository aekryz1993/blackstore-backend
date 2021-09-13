import notificationQueries from "../models/query/notification";
import { serverErrorMessage } from "../utils/messages";

export const getNotifications = (redisClient) => (req, res) => {
  (async () => {
    try {
      const userId = req.user.id;
      const notificationCount = await redisClient.get(userId);
      const initNotifications = await notificationQueries.findByUser(userId, 30);
      const notifications = initNotifications.length
        ? initNotifications.map(notification => ({
          id: notification.dataValues.id,
          seen: notification.dataValues.seen,
          action: notification.dataValues.action,
          from: notification.dataValues.from,
          product: notification.dataValues.Command.category,
          quantity: `${notification.dataValues.Command.quantity} codes`,
          date: notification.dataValues.Command.createdAt,
        }))
        : [];
      res.status(200).json({
        notificationCount: parseInt(notificationCount),
        notifications: notifications.reverse(),
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
