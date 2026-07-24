import client from "../queues/client.js";
import {Worker} from "bullmq"
import {callAiAgent} from "../llmProvider/callAiAgent.js"

export const aiPlanningWorker = new Worker('trip-planner-ai-queue',async (job)=>{
    const result = await callAiAgent(job.data, job.id)
    console.log("this is result ----->>>",result)

    return result
},{
    connection: client,
    concurrency: 2,
})

aiPlanningWorker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed`);
});

aiPlanningWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
