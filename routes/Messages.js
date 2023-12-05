require("dotenv").config();

const express = require("express");

const Messages = require("../models/Messages");
const { sendNewMessage, messageConfirmation } = require("../services/Email");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/send-message", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (name === "" || email === "" || subject === "" || message === "") {
    res.json({
      status: "FAILED",
      message: "Can't send message if some parts are empty",
    });
    return;
  }
  const newMessage = new Messages({ name, email, subject, message });
  await newMessage.save();
  sendNewMessage(name, email, subject, message);
  messageConfirmation(name, email);
  res.json({
    status: "SUCCESS",
    message: "Emails sent successfully",
    newMessage,
  });
});

router.get("/get-messages", authenticateToken, async (req, res) => {
  Messages.find({}, { _id: 0, __v: 0 })
    .then((allMessages) => {
      if (allMessages.length === 0) {
        res.json({
          status: "NONE",
          message: "No messages found!",
        });
        return;
      }
      if (allMessages) {
        res.json({
          status: "SUCCESS",
          allMessages,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Some error occurred while fetching all messages",
      });
    });
});

module.exports = router;
