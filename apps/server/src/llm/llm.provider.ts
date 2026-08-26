import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { groqForTask } from "./groq.config";
import { geminiForTask, hasGemini } from "./gemini.config";
import type { GROQ_DEFAULTS } from "./models/groq.models";

type Task = keyof typeof GROQ_DEFAULTS;

export const invokeLLM = async (
    messages: BaseLanguageModelInput,
    task: Task = "codeReview"
): Promise<{ content: string; provider: "groq" | "gemini" }> => {
    try {
        const response = await groqForTask(task).invoke(messages);
        return { content: response.content as string, provider: "groq" };
    } catch (err) {
        console.warn(`Groq failed for [${task}], falling back to Gemini:`, (err as Error).message);
    }

    if (hasGemini()) {
        try {
            const response = await geminiForTask(task).invoke(messages);
            return { content: response.content as string, provider: "gemini" };
        } catch (err) {
            console.warn(`Gemini failed for [${task}]:`, (err as Error).message);
        }
    }

    throw new Error(`All LLM providers failed for task: ${task}`);
};

export const getLLM = (task: Task = "codeReview") => ({
    primary: groqForTask(task),
    fallback: hasGemini() ? geminiForTask(task) : groqForTask(task),
});
