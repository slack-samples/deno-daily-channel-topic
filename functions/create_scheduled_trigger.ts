import { SlackAPI } from "deno-slack-api/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { CreateScheduledTrigger } from "../workflows/create_schedule.ts";

const createTrigger: SlackFunctionHandler<
  typeof CreateScheduledTrigger.definition
> = async (
  { inputs, token },
) => {
  console.log(`Creating trigger`);

  const client = SlackAPI(token, {});
  const scheduleDate = new Date();
  //Start schedule 1 minute in the future. Start_time must always be in the future.
  scheduleDate.setMinutes(scheduleDate.getMinutes() + 1);

  //./triggers/daily_schedule.txt has a json example of the payload
  const scheduledTrigger = await client.workflows.triggers.create({
    name: `Channel ${inputs.channel_id} Schedule`,
    workflow: "#/workflows/scheduled_update_topic",
    type: "scheduled",
    inputs: {
      channel_id: { value: inputs.channel_id },
    },
    schedule: {
      start_time: scheduleDate.toUTCString(),
      frequency: {
        type: "daily",
        repeats_every: 1
      }
    },
  });

  console.log(scheduledTrigger);

  return await {
    outputs: { trigger_id: scheduledTrigger.trigger.id },
  };
};

export default createTrigger;
