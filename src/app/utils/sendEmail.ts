import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rahulsd380@gmail.com",
        pass: "udzt yuom aqbg fdtm",
      },
    });

    await transporter.sendMail({
      from: "rahulsd380@gmail.com",
      to,
      subject: "Reset your password within 10 minutes",
      text: "Reset your password within 10 minutes",
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
