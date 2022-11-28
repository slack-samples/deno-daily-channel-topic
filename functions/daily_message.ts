import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
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

const generateMessage: SlackFunctionHandler<
  typeof GenerateDailyMessage.definition
> = async () => {
  console.log("About to generate message!");

  //This can be replaced to fetch the message from where ever necessary
  const message = `Today's date is ${new Date().toDateString()}`;

  console.log(message);

  return await {
    outputs: { message },
  };
};

export default generateMessage;
