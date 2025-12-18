import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../modules/User";
import { agenda } from "../services/scheduler";

const route = Router();

interface RequestExtended extends Request {
  userId: string;
}

function normalizeTime(time: string | undefined): string {
  if (!time || typeof time !== "string") return "09:00";

  const parts = time.split(":");

  let h = parts[0] ?? "09";
  let m = parts[1] ?? "00";

  const hourNum = Math.min(Math.max(parseInt(h) || 9, 0), 23);
  const minuteNum = Math.min(Math.max(parseInt(m) || 0, 0), 59);

  return `${hourNum.toString().padStart(2, "0")}:${minuteNum
    .toString()
    .padStart(2, "0")}`;
}

route.post(
  "/notification/update",
  authMiddleware as any,
  async (req: Request, res: Response) => {
    const request = req as RequestExtended;
    const { emailEnabled, smsEnabled, phone, reminderTime } = req.body;

    try {
      const userId = request.userId;

      const findUser = await User.findById(userId);
      if (!findUser) {
        return res.json({ message: "access denied" });
      }

      if (smsEnabled && (!phone || phone.trim() === "")) {
        return res.json({ message: "Phone number required for SMS" });
      }

      const normalizedTime = normalizeTime(reminderTime);

      findUser.notification = {
        emailEnabled,
        smsEnabled,
        phone: phone ?? "",
        reminderTime: normalizedTime,
      };
      await findUser.save();

      await agenda.cancel({
        name: "send-email-reminder",
        "data.userId": userId,
      });

      const [hour, minute] = normalizedTime.split(":");

      await agenda.every(`${minute} ${hour} * * *`, "send-email-reminder", {
        userId,
      });

      return res.json({
        message: "Notification settings updated successfully",
        notification: findUser.notification,
      });
    } catch (error) {
      console.log("Failed to update notification", error);
      return res.json({
        message: "Something went wrong, try again later",
      });
    }
  }
);

export default route;
