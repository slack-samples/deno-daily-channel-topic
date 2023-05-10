import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import { ReplyToMessageWorkflow } from "../workflows/reply_to_message.ts";

const trigger: Trigger<typeof ReplyToMessageWorkflow.definition> = {
  type: TriggerTypes.Event,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    // Update Channel Id on new installs
    channel_ids: ["REPLACE_WITH_YOUR_CHANNEL_ID"],
    filter: {
      root: {
        operator: "AND",
        inputs: [{
          operator: "NOT",
          inputs: [{
            // Filter out posts by apps
            statement: "{{data.user_id}} == null",
          }],
        }, {
          // Filter out thread replies
          statement: "{{data.thread_ts}} == null",
        }],
      },
      version: 1,
    },
  },
  name: "Reply to the posted message",
  workflow: `#/workflows/${ReplyToMessageWorkflow.definition.callback_id}`,
  inputs: {
    // TODO: message_posted event triggers currently do not support providing a message_context data object.
    // however, in the future it will. when that support lands, we should change these properties
    // to be a single message_context property and type, provided by {{data.message_context}}.
    message_ts: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
    channel_id: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
  },
};

export default trigger;
