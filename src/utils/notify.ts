import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function SendEmail(userEmail: string, plans: any) {
  const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>Your Idea Reminder</h2>
    <p>Here are your plan you need to follow</p>
    <ul>
      ${plans.map((p: any) => `<li>${p}</li>`).join("")}
    </ul>
  </div>
`;

  try {
    await transport.sendMail({
      from: `"Idea Planner" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Your Daily Idea Reminder",
      html,
    });
    console.log("Email sent to:", userEmail);
  } catch (error) {
    console.log("Failed to send the reminder", error);
  }
}
