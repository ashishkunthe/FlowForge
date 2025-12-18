import dotenv from "dotenv";
import Agenda from "agenda";
import { User } from "../modules/User";
import { Plan } from "../modules/Plan";
import { SendEmail } from "../utils/notify";

dotenv.config();

export const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI as string },
});

// @ts-ignore
agenda.define("send-email-reminder", async (job) => {
  const { userId } = job.attrs.data as { userId: string };

  console.log("new Id", userId);

  const user = await User.findById(userId);
  if (!user) return;
  //   @ts-ignore
  if (!user.notification.emailEnabled) return;

  const plan = await Plan.findOne({ userId }).sort({ createdAt: -1 });
  if (!plan) return;

  await SendEmail(user.email, plan);
});

export async function startScheduler() {
  await agenda.start();
  console.log("Agenda scheduler started");
}
