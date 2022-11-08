import { DefineFunction, DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

export const DeleteScheduledTrigger = DefineFunction({
  title: "Delete the scheduled topic update for a channel",
  callback_id: "delete_scheduled_trigger",
  source_file: "functions/delete_scheduled_trigger.ts",
  input_parameters: {
    properties: {
      channel_id: {
        description: "The id of the channel to delete the trigger for",
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel_id"],
  },
});

export const DeleteScheduleWorkflow = DefineWorkflow(
  {
    callback_id: "delete_schedule",
    title: "Delete the scheduled topic update for a channel",
    description: "Delete the scheduled topic update for a channel",
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

const formData = DeleteScheduleWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Delete Schedule",
    interactivity: DeleteScheduleWorkflow.inputs.interactivity,
    submit_label: "Submit",
    description: "Delete the scheduled topic update for a channel",
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

DeleteScheduleWorkflow.addStep(
  DeleteScheduledTrigger,
  {
    channel_id: formData.outputs.fields.channel_id,
  },
);
