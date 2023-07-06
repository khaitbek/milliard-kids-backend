import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number(),
  SHADOW_DATABASE_URL: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

envVariables.parse(process.env);
