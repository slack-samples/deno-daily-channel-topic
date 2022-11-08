import { SlackAPI } from "deno-slack-api/mod.ts";
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { EnsureChannelJoined } from "../workflows/common/ensure_channel_joined.ts";

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
