import { config } from "dotenv";

config();

export default {
  // application configurations
  appName: process.env.APP_NAME || "",
  appPort: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  secretKey: "MILLIARD_KIDS",
};
