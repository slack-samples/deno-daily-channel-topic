//This Workflow is designed to be triggered by scheduled triggers created under the Create_Schedule workflow
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { EnsureChannelJoined } from "../functions/ensure_channel_joined.ts";
import { GenerateDailyMessage } from "../functions/daily_message.ts";

export const UpdateTopicWorkflow = DefineWorkflow(
  {
    callback_id: "update_topic",
    title: "Update a topic with a daily message",
    description: "Update a topic with a daily message",
    input_parameters: {
      properties: {
        interactivity: {
          type: Schema.slack.types.interactivity,
        },
      },
      required: ["interactivity"],
    },
  },
);

const formData = UpdateTopicWorkflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Update Channel Topic",
  interactivity: UpdateTopicWorkflow.inputs.interactivity,
  submit_label: "Submit",
  description: "Update a channel with today's topic",
  fields: {
    required: ["channel_id"],
    elements: [
      {
        name: "channel_id",
        title: "The Channel to update the topic for",
        type: Schema.slack.types.channel_id,
      },
    ],
  },
});

const generateMessageStep = UpdateTopicWorkflow.addStep(
  GenerateDailyMessage,
  {},
);

// Certain functions, like setting the channel topic, require that the bot is part of the channel
UpdateTopicWorkflow.addStep(
  EnsureChannelJoined,
  {
    channel_id: formData.outputs.fields.channel_id,
  },
);

UpdateTopicWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: formData.outputs.fields.channel_id,
    message: `Setting topic to ${generateMessageStep.outputs.message}`,
  },
);

UpdateTopicWorkflow.addStep(Schema.slack.functions.UpdateChannelTopic, {
  channel_id: formData.outputs.fields.channel_id,
  topic: generateMessageStep.outputs.message,
});

UpdateTopicWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: formData.outputs.fields.channel_id,
    message: `Topic set`,
  },
);
