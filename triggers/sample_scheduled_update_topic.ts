// Included as an example of what a scheduled trigger would look like in a JSON format.
// Scheduled trigger will be created programmatically in functions/create_scheduled_trigger.ts
import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";

const trigger: Trigger = {
  type: TriggerTypes.Scheduled,
  name: "daily_schedule",
  workflow: "#/workflows/update_topic",
  schedule: {
    start_time: "2022-08-0T15:30:00Z",
    timezone: "UTC",
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default trigger;
