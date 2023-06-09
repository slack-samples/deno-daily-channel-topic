import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const DeleteScheduledTrigger = DefineFunction({
  title: "Delete the scheduled topic update for a channel",
  callback_id: "delete_scheduled_trigger",
  source_file: "functions/delete_scheduled_trigger.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The id of the channel to delete the trigger for",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
});

export default SlackFunction(
  DeleteScheduledTrigger,
  async ({ inputs, token }) => {
    console.log(`Deleting trigger ${inputs.channel_id}`);

    const client = SlackAPI(token, {});
    const triggerList = await client.workflows.triggers.list();

    console.log(triggerList.triggers);

    if (triggerList.triggers) {
      let channelTrigger;
      try {
        channelTrigger = triggerList.triggers.find((
          // deno-lint-ignore no-explicit-any
          i: { inputs: { [id: string]: any } },
        ) => i.inputs?.channel_id?.value == inputs.channel_id);
        console.log(channelTrigger);
      } catch (error) {
        return {
          error: "Could not filter triggers Error: " + error,
        };
      }

      if (channelTrigger) {
        const resp = await client.workflows.triggers.delete({
          trigger_id: channelTrigger.id,
        });

        if (!resp.ok && resp.error) {
          return {
            error: resp.error,
          };
        }
      }
    }

    return {
      outputs: {},
    };
  },
);
