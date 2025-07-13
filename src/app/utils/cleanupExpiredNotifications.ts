import cron from "node-cron";
import Notification from "../modules/notification/notification.model";

export const cleanupExpiredNotifications = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      await Notification.deleteMany({ endDate: { $lt: now } });
      console.log("Expired notifications cleaned up.");
    } catch (error) {
      console.error("Error deleting expired notifications:", error);
    }
  });
};
