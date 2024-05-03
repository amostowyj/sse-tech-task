import express from "express";
import routes from "./routes/index";

const app = express();

app.use("/user", routes.user);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
