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
  console.log("🟡 JOB TRIGGERED");

  try {
    if (!job.attrs.data) {
      console.log("❌ No job data found");
      return;
    }

    const { userId } = job.attrs.data as { userId: string };
    console.log("🟢 USER ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return;
    }

    if (!user.notification?.emailEnabled) {
      console.log("⚠️ Email notifications disabled for user");
      return;
    }

    const plan = await Plan.findOne({ userId }).sort({ createdAt: -1 });
    if (!plan) {
      console.log("⚠️ No plan found for user");
      return;
    }

    console.log("📤 Sending email to:", user.email);

    await SendEmail(user.email, plan.nextSteps);

    console.log("✅ EMAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.error("🔥 AGENDA JOB FAILED:", error);
  }
});

export async function startScheduler() {
  await agenda.start();
  console.log("🚀 Agenda scheduler started");
}
