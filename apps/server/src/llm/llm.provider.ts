import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { baiForTask, hasBai } from "./bai.config";
import { groqForTask } from "./groq.config";
import { geminiForTask, hasGemini } from "./gemini.config";
import type { GROQ_DEFAULTS } from "./models/groq.models";

type Task = keyof typeof GROQ_DEFAULTS;

const responseContentToString = (content: unknown): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content.map((block) => {
            if (
                typeof block === "object" &&
                block !== null &&
                "text" in block &&
                typeof block.text === "string"
            ) {
                return block.text;
            }
            return JSON.stringify(block);
        }).join("\n");
    }
    return JSON.stringify(content);
};

export const invokeLLM = async (
    messages: BaseLanguageModelInput,
    task: Task = "codeReview"
): Promise<{ content: string; provider: "bai" | "groq" | "gemini" }> => {
    if (hasGemini()) {
        try {
            const response = await geminiForTask(task).invoke(messages);
            return { content: responseContentToString(response.content), provider: "gemini" };
        } catch (err) {
            console.warn(`Gemini failed for [${task}], falling back to BAI/Groq:`, (err as Error).message);
        }
    }

    if (hasBai()) {
        try {
            const response = await baiForTask(task).invoke(messages);
            return { content: responseContentToString(response.content), provider: "bai" };
        } catch (err) {
            console.warn(`BAI failed for [${task}], falling back to Groq:`, (err as Error).message);
        }
    }

    try {
        const response = await groqForTask(task).invoke(messages);
        return { content: responseContentToString(response.content), provider: "groq" };
    } catch (err) {
        console.warn(`Groq failed for [${task}]:`, (err as Error).message);
        throw new Error(`All LLM providers failed for task: ${task}`);
    }
};

export const getLLM = (task: Task = "codeReview") => ({
    primary: hasGemini() ? geminiForTask(task) : hasBai() ? baiForTask(task) : groqForTask(task),
    fallback: hasGemini() ? (hasBai() ? baiForTask(task) : groqForTask(task)) : groqForTask(task),
});
