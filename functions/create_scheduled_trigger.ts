import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const CreateScheduledTrigger = DefineFunction({
  title: "Create a scheduled trigger",
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

export default SlackFunction(
  CreateScheduledTrigger,
  async ({ inputs, token }) => {
    console.log(`Creating scheduled trigger to update daily topic`);

    const client = SlackAPI(token, {});
    const scheduleDate = new Date();
    // Start schedule 1 minute in the future. Start_time must always be in the future.
    scheduleDate.setMinutes(scheduleDate.getMinutes() + 1);

    // triggers/sample_scheduled_update_topic.ts has a JSON example of the payload
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

    if (!scheduledTrigger.trigger) {
      return {
        error: "Trigger could not be created",
      };
    }

    console.log("scheduledTrigger has been created");

    return {
      outputs: { trigger_id: scheduledTrigger.trigger.id },
    };
  },
);
