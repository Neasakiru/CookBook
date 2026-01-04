import express from "express";
import fs from "fs";

const app = express();

const data = JSON.parse(fs.readFileSync("baza.txt", "utf8"));

app.get("/", (req, res) => {
  res.send(JSON.stringify(data));
});

app.listen(3000);
