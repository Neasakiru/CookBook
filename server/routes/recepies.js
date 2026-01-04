import { Router } from "express";
import fs from "fs";

const router = Router();

const data = JSON.parse(fs.readFileSync("baza.txt", "utf8"));

router.get("/", (req, res) => {
  res.send(JSON.stringify(data));
});

export default router;
