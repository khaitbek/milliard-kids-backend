import config from "@/config";
import morgan from "@middlewares/logger.middleware";
import { router as authRouter } from "@routes/auth.router";
import { router as classRouter } from "@routes/class.router";
import Logger from "@utils/logger.utils";
import cors from "cors";
import express from "express";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

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
app.use(classRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Successfully connected to api." });
});
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", serve, setup(specs, { explorer: true }));
const server = app.listen(config.appPort, () => {
  Logger.debug(`Server ushbu manzilda ishlamoqda -->> http://localhost:${config.appPort}`);
});

export default server;
