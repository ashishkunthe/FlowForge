import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export interface llmInputs {
  title?: string;
  mainIdea?: string;
  motivation?: string;
  howToAchieve?: string;
}

export const planSchema = z.object({
  summary: z.string(),
  roadmap: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      estimate: z.string().optional(),
    })
  ),
  challenges: z.array(z.string()),
  improvements: z.array(z.string()),
  nextSteps: z.array(z.string()),
});

export async function generatePlan({
  title,
  mainIdea,
  motivation,
  howToAchieve,
}: llmInputs) {
  try {
    const parser = StructuredOutputParser.fromZodSchema(planSchema);

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are an expert startup advisor and technical strategist.
        Your job is to take a user's idea and generate a structured execution plan.

        Return ONLY valid JSON in this format:
        {format_instructions}

        Idea Details:
        Title: {title}
        Main Idea: {mainIdea}
        Motivation: {motivation}
        How To Achieve: {howToAchieve}
        `);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
      maxTokens: 800,
    });

    const finalPrompt = await prompt.format({
      title: title ?? "",
      mainIdea: mainIdea ?? "",
      motivation: motivation ?? "",
      howToAchieve: howToAchieve ?? "",
      format_instructions: parser.getFormatInstructions(),
    });

    const response = await model.invoke(finalPrompt);

    const parsed = await parser.parse(response.content as string);
    return parsed;
  } catch (err: any) {
    console.error("LLM ERROR:", err);
    throw new Error("Failed to generate plan from AI");
  }
}
