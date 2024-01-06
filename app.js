const express = require("express");
const bodyParser = require("body-parser");
const dbconnect = require("./utils/conn.js");
const v1 = require("./routes/v1");
const resource = require("./routes/resource");
var cors = require("cors");
const path = require("path");
const {chatController} = require("./controllers/chat/chat.controller.js");
const dotenv = require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

let port = process.env.PORT || 8000;
const http = require("http");
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());
app.use(
  express.json({
    limit: "5000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Socket.IO connection event handler
io.on("connection", (socket) => {
 

  // Pass the socket to the chatController
  chatController(app, io, socket);

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api/v1", v1);

app.get("/", (req, res) => res.send("test server"));

server.listen(port, () => {
  console.log(`server is running at ${port}`);
});

module.exports = app;

///cloce
//console.log(process.env.HOST);

// app.use("/uploads", express.static("uploads"));
// app.use("/api/resource", resource);
// app.use("/v2", v2);
// /api/v1 ==> Routes Folder
// const v2 = require("./routes/v2");

// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// let port = process.env.PORT || 8000;

// io.on("connection", (socket) => {
//   console.log("connected");
//   console.log(socket.id, "has joined");
//   // socket.on("/test", (msg) => {
//   //   console.log(msg);
//   // });
// });

// server.listen(port, () => {
//   console.log(`server is running at ${port}`);
// });

// module.exports = app;
