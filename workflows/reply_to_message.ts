import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateDailyMessage } from "../functions/daily_message.ts";

export const ReplyToMessageWorkflow = DefineWorkflow(
  {
    callback_id: "reply_to_message",
    title: "Reply to the message posted",
    description: "Reply with today's message",
    input_parameters: {
      properties: {
        // TODO: this workflow is intended to be triggered by triggers/message_posted_event
        // this trigger currently does not support providing in a message_context object.
        // however, in the future it will. when that support lands, we should change these properties
        // to be a single message_context property and type, passed in from the above trigger.
        message_ts: {
          description: "The message to respond to",
          type: Schema.types.string,
        },
        channel_id: {
          description: "The id of the Channel to join",
          type: Schema.slack.types.channel_id,
        },
      },
      required: ["channel_id", "message_ts"],
    },
  },
);

const generateMessageStep = ReplyToMessageWorkflow.addStep(
  GenerateDailyMessage,
  {},
);

ReplyToMessageWorkflow.addStep(
  Schema.slack.functions.ReplyInThread,
  {
    message_context: {
      channel_id: ReplyToMessageWorkflow.inputs.channel_id,
      message_ts: ReplyToMessageWorkflow.inputs.message_ts,
    },
    message:
      `This message was replied to by the Bot. ${generateMessageStep.outputs.message}`,
  },
);
