import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PlanInput {
  requirement: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
}

/**
 * Multi-Agent Orchestration for Planning
 */
export async function generateAgenticPlan(input: PlanInput): Promise<string> {
  const { requirement, startDate, endDate, hoursPerWeek } = input;

  // 1. Researcher Agent: Gathers context and key components for the requirement
  const researchPrompt = `
    You are a Researcher Agent. Your goal is to research and break down the following requirement into its core components, key milestones, and necessary resources.
    Requirement: "${requirement}"
    
    Provide a structured summary of:
    1. Core skills or knowledge areas involved.
    2. Key milestones for a 30-day period.
    3. Recommended resources or types of practice.
  `;

  const researchResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: researchPrompt,
  });
  const researchData = researchResponse.text;

  // 2. Planner Agent: Creates a day-by-day schedule based on research and user constraints
  const plannerPrompt = `
    You are a Planner Agent. Your goal is to create a detailed, day-by-day action plan based on the research provided and the user's constraints.
    
    User Requirement: "${requirement}"
    Start Date: ${startDate}
    End Date: ${endDate}
    Available Time: ${hoursPerWeek} hours per week.
    
    Research Data:
    ${researchData}
    
    Instructions:
    - Create a day-by-day plan from ${startDate} to ${endDate}.
    - For each day, provide specific actions and hands-on practices if applicable.
    - Ensure the workload respects the ${hoursPerWeek} hours per week limit.
    - Format the output in Markdown. Use clear headings for each day.
    - Include a "Weekly Summary" at the end of each week.
  `;

  const plannerResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: plannerPrompt,
  });
  const rawPlan = plannerResponse.text;

  // 3. Reviewer Agent: Refines the plan for clarity, consistency, and tone
  const reviewerPrompt = `
    You are a Reviewer Agent. Your goal is to refine and polish the following action plan.
    
    Original Plan:
    ${rawPlan}
    
    Instructions:
    - Ensure the tone is encouraging and professional.
    - Check for logical progression in the daily tasks.
    - Make sure the formatting is consistent and easy to read.
    - If there are any gaps in the daily sequence, fill them.
    - Output the final, polished Markdown plan.
  `;

  const reviewerResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: reviewerPrompt,
  });

  return reviewerResponse.text || "Failed to generate plan.";
}
