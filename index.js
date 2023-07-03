const express = require("express");
const app = express();
let ejs = require("ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const newWord = req.body.newbox;
  console.log(newWord);
  res.redirect("/");
});

app.listen("3000", function () {
  console.log("The server has been started from the port 3000");
});
