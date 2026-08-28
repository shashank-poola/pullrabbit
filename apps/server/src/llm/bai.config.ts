import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.config";
import type { GROQ_DEFAULTS } from "./models/groq.models";

export const BAI_MODEL = "glm-5.3-flash";
const BAI_BASE_URL = "https://api.b.ai/v1";

export const hasBai = (): boolean => Boolean(env.BAI_API_KEY);

export const baiForTask = (_task: keyof typeof GROQ_DEFAULTS) => {
    if (!env.BAI_API_KEY) throw new Error("BAI_API_KEY not set");

    return new ChatOpenAI({
        apiKey: env.BAI_API_KEY,
        model: BAI_MODEL,
        temperature: 0.1,
        configuration: { baseURL: BAI_BASE_URL },
    });
};
