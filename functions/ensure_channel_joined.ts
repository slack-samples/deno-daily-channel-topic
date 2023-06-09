import { SlackAPI } from "deno-slack-api/mod.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

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

export default SlackFunction(
  EnsureChannelJoined,
  async ({ inputs, token }) => {
    const client = SlackAPI(token);

    const joinResponse = await client.conversations.join({
      channel: inputs.channel_id,
    });
    if (!joinResponse.ok) throw new Error(joinResponse.error);

    return {
      outputs: {},
    };
  },
);
