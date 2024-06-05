const express = require('express');

const app = express()

app.set("view engine", "ejs");

const port = 3000;

app.get("/home", (req, res) => {
  res.render("index")
});

app.get("/about", (req, res) => {
  res.render("about")
});
app.get("/blog", (req, res) => {
  res.render("blog")
});

app.listen(port, () => {
  console.log(`server running at ${port}`);
});