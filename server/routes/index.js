const path = require("path");
const express = require("express");

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.sendFile(
      path.resolve("index.html")
    );
  });
};