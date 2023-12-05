require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const adminsRouter = require("./routes/Admins");
app.use("/admins", adminsRouter);
const responsesRouter = require("./routes/Responses");
app.use("/responses", responsesRouter);
const messagesRouter = require("./routes/Messages");
app.use("/messages", messagesRouter);

mongoose.connect(process.env.MONGOOSE_CONNECT);

server.listen(process.env.PORT || 3001, () => {
  console.log("server running");
});
