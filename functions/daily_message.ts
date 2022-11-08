import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { GenerateDailyMessage } from "../workflows/common/generate_daily_message_definition.ts";

const generateMessage: SlackFunctionHandler<
  typeof GenerateDailyMessage.definition
> = async () => {
  console.log ("About to generate message!");

  //This can be replaced to fetch the message from where ever necessary
  const message = `Today's date is ${new Date().toDateString()}`;

  console.log (message);

  return await {
    outputs: { message },
  };
};

export default generateMessage;
