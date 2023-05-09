import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { UpdateTopicWorkflow } from "../workflows/update_topic.ts";

const trigger: Trigger<typeof UpdateTopicWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Update Topic",
  description: "Update the topic with today's message",
  workflow: `#/workflows/${UpdateTopicWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
