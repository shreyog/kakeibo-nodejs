const { Router } = require("express");

const route = Router();
route.get("/me", (req, res) => {
  res.send({ message: "Hello Shreyog" });
});

module.exports = route;
