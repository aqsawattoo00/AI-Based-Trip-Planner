import OpenAI from "openai";
import { AiPromet } from "../prompts/trip-planner-ai-prompt.js";

import client from "../queues/client.js"
import TripResult from "../models/TripResult.js"

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});


export const callAiAgent = async (userData, jobId) => {
    let fullContent = ""
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system", content: AiPromet(),
                },
                {
                    role: "user", content: JSON.stringify(userData)
                }
            ],
            stream: true
        })

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;

            if (content) {
                fullContent += content
                await client.publish(`job:${jobId}`, content);
            }
        }

        await client.publish(`job:${jobId}`, "[DONE]");

        // persist the full AI result to DB if userId and projectId are available
        try {
            const userId = userData?.userId
            const projectId = userData?.projectId
            if (userId && projectId) {
                await TripResult.findOneAndUpdate(
                    { userId, projectId },
                    { result: fullContent },
                    { upsert: true, new: true }
                )
            }
        } catch (saveErr) {
            console.error("Failed to save TripResult:", saveErr)
        }

        return fullContent
    } catch (error) {
        console.error("Error calling AI agent:", error);
        await client.publish(`job:${jobId}`, "[DONE]");
        return fullContent
    }
}
