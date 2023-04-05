import { Trigger } from "deno-slack-sdk/types.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Update Topic",
  description: "Update the topic with today's message",
  workflow: "#/workflows/update_topic",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
