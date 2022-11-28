import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";

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

const deleteTrigger: SlackFunctionHandler<
  typeof DeleteScheduledTrigger.definition
> = async (
  { inputs, token },
) => {
  console.log(`Deleting trigger ${inputs.channel_id}`);

  const client = SlackAPI(token, {});
  const triggerlist = await client.workflows.triggers.list();

  console.log(triggerlist.triggers);

  const channelTrigger = triggerlist.triggers.find((
    i: { inputs: { channel_id: { value: string } } },
  ) => i.inputs?.channel_id?.value == inputs.channel_id);
  console.log(channelTrigger);

  await client.workflows.triggers.delete({
    trigger_id: channelTrigger.id,
  });

  return await {
    outputs: {},
  };
};

export default deleteTrigger;
