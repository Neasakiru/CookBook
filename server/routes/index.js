import { Router } from "express";

const router = Router();

const data = 'Server działa! Lista dostepnych endpointów "/", "/recepies" ';

router.get("/", (req, res) => {
  res.send(data);
});

export default router;
