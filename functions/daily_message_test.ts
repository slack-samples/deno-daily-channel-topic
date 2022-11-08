import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import MessageFunction from "./daily_message.ts";

const { createContext } = SlackFunctionTester("greeting_function");

Deno.test("Greeting function test", async () => {
  const { outputs } = await MessageFunction(createContext({ inputs: {} }));
  assertEquals(
    outputs?.message.includes(new Date().toDateString()),
    true,
  );
});
