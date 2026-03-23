import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({
    path: path.resolve(process.cwd(), "../../.env"),
})

const EnvSchema = z.object({
    PORT: z.string().default("8000").transform(Number),
    SERVER_JWT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SERVER: z.string().min(1),
    GITHUB_CALLBACK_URL: z.string().min(1),
    REDIS_URL: z.string().optional(),
    EMBED_MODEL: z.string().optional(),
    QDRANT_APP_URL: z.string().optional(),
    QDRANT_CLUSTER_ID: z.string().optional(),
    GOOGLE_GEMINI_API: z.string().optional(),
    SERPER_API: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
  });
  
  export const env = EnvSchema.parse(process.env);