const express = require("express");
const bodyParser = require("body-parser");
const dbconnect = require("./utils/conn.js");
var cors = require("cors");
const path = require("path");

// const v2 = require("./routes/v2");
 const v1 = require("./routes/v1");

const dotenv = require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

// /api/v1 ==> Routes Folder

let port = process.env.PORT || 8000;
const app = express();
//console.log(process.env.HOST);

// app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(
  express.json({
    limit: "5000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});

app.use("/api/v1", v1);
// app.use("/v2", v2);

app.get("/", (req, res) => res.send("test server"));
module.exports = app;
