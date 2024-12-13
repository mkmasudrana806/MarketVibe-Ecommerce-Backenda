import nodemailer from "nodemailer";
import config from "../config";
/**
 * sendEmail for reseting user password
 *
 * @param receiver receiver email address
 * @param body body of this email address in html format
 * @returns return nothing
 */
const sendEmail = async (receiver: string, body: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_environment === "production",
    auth: {
      user: config.node_mailer_user,
      pass: config.node_mailer_password,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: config.node_mailer_user,
    to: receiver,
    subject: "Reset Your Password Within 10 min",
    text: "Hello Dear, please reset your password within 10 min. here is the reset link",
    html: body,
  });
  return;
};

export default sendEmail;
