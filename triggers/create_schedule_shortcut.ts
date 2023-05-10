import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { CreateScheduleWorkflow } from "../workflows/create_schedule.ts";

const trigger: Trigger<typeof CreateScheduleWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Create Schedule",
  description: "Schedule the Daily update of a channel topic",
  workflow: `#/workflows/${CreateScheduleWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
