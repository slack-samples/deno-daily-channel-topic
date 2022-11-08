import { Trigger } from "deno-slack-api/types.ts";

const trigger: Trigger = {
  type: "event",
  event: {
    event_type: "slack#/events/message_posted",
    //Update Channel Id on new installs
    channel_ids: ["REPLACE_WITH_YOUR_CHANNEL_ID"],
    filter: {
      root: {
        operator: "AND",
        inputs: [{
          operator: "NOT",
          inputs: [{
            //Filter out posts by apps
            statement: "{{data.user_id}} == null",
          }],
        }, {
          //Filter out thread replies
          statement: "{{data.thread_ts}} == null",
        }],
      },
      version: 1,
    },
  },
  name: "Reply to the posted message",
  workflow: "#/workflows/reply_to_message",
  inputs: {
    message_ts: {
      value: "{{data.message_ts}}",
    },
    channel_id: {
      value: "{{data.channel_id}}",
    },
  },
};

export default trigger;
