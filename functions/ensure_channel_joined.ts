import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";

export const EnsureChannelJoined = DefineFunction({
  title: "Ensure the bot is part of the channel",
  callback_id: "ensure_channel_joined",
  source_file: "functions/ensure_channel_joined.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The id of the Channel to join",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
});

const ensureChannelJoined: SlackFunctionHandler<
  typeof EnsureChannelJoined.definition
> = async (
  { inputs, token },
) => {
  const client = SlackAPI(token);

  //No negative to running this multiple times for the same channel
  const ret = await client.conversations.join({ channel: inputs.channel_id });
  if (!ret.ok) throw new Error(ret.error);

  return await {
    outputs: {},
  };
};

export default ensureChannelJoined;
