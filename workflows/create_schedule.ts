import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateScheduledTrigger } from "../functions/create_scheduled_trigger.ts";

export const CreateScheduleWorkflow = DefineWorkflow(
  {
    callback_id: "create_schedule",
    title: "Schedule the Daily update of a channel topic",
    description: "Schedule the Daily update of a channel topic",
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

const formData = CreateScheduleWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create Schedule",
    interactivity: CreateScheduleWorkflow.inputs.interactivity,
    submit_label: "Submit",
    description: "Schedule the Daily update of a channel topic",
    fields: {
      required: ["channel_id"],
      elements: [
        {
          name: "channel_id",
          title: "The Channel to create the schedule for",
          type: Schema.slack.types.channel_id,
        },
      ],
    },
  },
);

CreateScheduleWorkflow.addStep(
  CreateScheduledTrigger,
  {
    channel_id: formData.outputs.fields.channel_id,
  },
);
