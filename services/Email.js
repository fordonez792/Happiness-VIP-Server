require("dotenv").config();

const nodemailer = require("nodemailer");

// This file contains all sending email functions
// Within are email to admin when a review has been reported 10 times, and email to verify a users email address

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Sends email to admin when a review has reached 10 report votes, admin can then be notified and moderate the reviews
const sendNewMessage = (name, email, subject, message) => {
  const emailOptions = {
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Message Received: ${subject}`,
    html: `<p>New message received from ${name} with email address ${email}!</p>
    <p>Subject: ${subject}</p>
    <p>Message: ${message}</p>`,
  };

  transporter.sendMail(emailOptions).catch((error) => {
    console.log(error);
    return;
  });
};

// Sends email to user that is creating an account, so that they can verify their email address
const messageConfirmation = (name, email) => {
  const emailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Message Sent Confirmation",
    html: `<p>Hi ${name}!</p>
    <p>Thank you for sending a message to us! We will get back to you as soon as possible.</p> 
    <p>Please do not reply directly to this email. If you have any questions or comments regarding this email please contact us at ____</p>`,
  };

  transporter.sendMail(emailOptions).catch((error) => {
    console.log(error);
    return;
  });
};

module.exports = { sendNewMessage, messageConfirmation };
