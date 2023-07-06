import express from "express";
import passport from "passport";
import cors from "cors";
import config from "@/config";
import morgan from "@middlewares/logger.middleware";
import Logger from "@utils/logger.utils";
import { router as authRouter } from "@routes/auth.router";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use(morgan);
app.use(passport.initialize());
app.use(authRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Successfully connected to api." });
});

const server = app.listen(config.appPort, () => {
  Logger.debug(`Server is up and running @ http://localhost:${config.appPort}`);
});

export default server;
