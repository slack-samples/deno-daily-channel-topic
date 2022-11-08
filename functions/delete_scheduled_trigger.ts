import { SlackAPI } from "deno-slack-api/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { DeleteScheduledTrigger } from "../workflows/delete_schedule.ts";

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
