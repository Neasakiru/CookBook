import express from "express";

import indexRoutes from "./routes/index.js";
import recepiesRoutes from "./routes/recepies.js";

const app = express();

app.use(express.json());

app.use("/", indexRoutes);
app.use("/recepies", recepiesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
