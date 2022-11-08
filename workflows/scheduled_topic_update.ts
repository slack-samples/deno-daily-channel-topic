//This Workflow is designed to be triggered by scheduled triggers created under the Create_Schedule workflow
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { EnsureChannelJoined } from "./common/ensure_channel_joined.ts";
import { GenerateDailyMessage } from "./common/generate_daily_message_definition.ts";

export const ScheduledUpdateTopicWorkflow = DefineWorkflow(
  {
    callback_id: "scheduled_update_topic",
    title: "Update a topic with a daily message on a schedule",
    description: "Update a topic with a daily message",
    input_parameters: {
      properties: {
        channel_id: {
          title: "The Channel to update the topic for",
          type: Schema.slack.types.channel_id,
        },
      },
      required: ["channel_id"],
    },
  },
);

const generateMessageStep = ScheduledUpdateTopicWorkflow.addStep(
  GenerateDailyMessage,
  {},
);

//Certain functions, like setting the channel topic require that the bot is part of the channel
ScheduledUpdateTopicWorkflow.addStep(
  EnsureChannelJoined,
  {
    channel_id: ScheduledUpdateTopicWorkflow.inputs.channel_id,
  },
);

ScheduledUpdateTopicWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: ScheduledUpdateTopicWorkflow.inputs.channel_id,
    message: `Setting topic to ${generateMessageStep.outputs.message}`,
  },
);

ScheduledUpdateTopicWorkflow.addStep(
  Schema.slack.functions.UpdateChannelTopic,
  {
    channel_id: ScheduledUpdateTopicWorkflow.inputs.channel_id,
    topic: generateMessageStep.outputs.message,
  },
);

ScheduledUpdateTopicWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: ScheduledUpdateTopicWorkflow.inputs.channel_id,
    message: `Topic set`,
  },
);
