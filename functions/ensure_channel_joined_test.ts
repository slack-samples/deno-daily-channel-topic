import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import EnsureChannelJoined from "./ensure_channel_joined.ts";

const { createContext } = SlackFunctionTester("joinChannel");

Deno.test("Join Channel", async (t) => {
  mf.install(); // mock out calls to `fetch`

  // Create test values
  const inputs = {
    channel_id: "123",
  };

  await t.step("Request to Join Channel", async () => {
    const apiSuccessResponse = {
      ok: true,
    };

    mf.mock("POST@/api/conversations.join", (req: Request) => {
      assertEquals(req.url, "https://slack.com/api/conversations.join"); // verify request is made
      return new Response(JSON.stringify(apiSuccessResponse));
    });

    // Inject test context
    const { outputs } = await EnsureChannelJoined(createContext({ inputs }));

    // Assert success output
    assertExists(outputs);
  });
});
