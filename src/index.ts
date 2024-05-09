import express from "express";
import routes from "./routes/index";
import bodyParser from "body-parser";
import { handleAnalytics } from "./middleware/analytics";
import errorHandler from "./middleware/error-handler";

const app = express();

app.use(bodyParser.json());
app.use(handleAnalytics);
app.use(errorHandler);

app.use("/user", routes.user);
app.use("/message", routes.message);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/healthcheck", async (_req, res) => {
  res.status(200).send("The application is healthy!");
});
