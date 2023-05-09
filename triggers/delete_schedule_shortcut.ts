import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { DeleteScheduleWorkflow } from "../workflows/delete_schedule.ts";

const trigger: Trigger<typeof DeleteScheduleWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Delete Schedule",
  description: "Delete the scheduled topic update for a channel",
  workflow: `#/workflows/${DeleteScheduleWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
