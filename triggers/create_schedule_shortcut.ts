import { Trigger } from "deno-slack-api/types.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Create Schedule",
  description: "Schedule the Daily update of a channel topic",
  workflow: "#/workflows/create_schedule",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
