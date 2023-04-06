import { Trigger } from "deno-slack-sdk/types.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Delete Schedule",
  description: "Delete the scheduled topic update for a channel",
  workflow: "#/workflows/delete_schedule",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
