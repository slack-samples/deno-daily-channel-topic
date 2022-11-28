import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";

export const CreateScheduledTrigger = DefineFunction({
  title: "Create a scheduled Trigger",
  callback_id: "create_scheduled_trigger",
  source_file: "functions/create_scheduled_trigger.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The id of the Channel to create a schedule for",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      trigger_id: {
        description: "The ID of the trigger created by the Slack API",
        type: Schema.types.string,
      },
    },
    required: ["trigger_id"],
  },
});

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
        repeats_every: 1,
      },
    },
  });

  console.log(scheduledTrigger);

  return await {
    outputs: { trigger_id: scheduledTrigger.trigger.id },
  };
};

export default createTrigger;
