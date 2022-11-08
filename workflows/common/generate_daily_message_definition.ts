import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const GenerateDailyMessage = DefineFunction({
    title: "Generate Daily Message",
    callback_id: "daily_message",
    source_file: "functions/daily_message.ts",
    output_parameters: {
      properties: {
        message: {
          description: "The daily message",
          type: Schema.types.string,
        },
      },
      required: ["message"],
    },
  });