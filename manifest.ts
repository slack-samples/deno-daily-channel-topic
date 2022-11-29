//Manifest.ts defines the functions/workflows to be incorporated in the app as well as other configuration

import { Manifest } from "deno-slack-sdk/mod.ts";
import { CreateScheduleWorkflow } from "./workflows/create_schedule.ts";
import { DeleteScheduleWorkflow } from "./workflows/delete_schedule.ts";
import { UpdateTopicWorkflow } from "./workflows/update_topic.ts";
import { ScheduledUpdateTopicWorkflow } from "./workflows/scheduled_update_topic.ts";
import { ReplyToMessageWorkflow } from "./workflows/reply_to_message.ts";

export default Manifest({
  name: "daily-topic-bot",
  description: "A starter template.",
  icon: "assets/icon.jpg",
  workflows: [
    UpdateTopicWorkflow,
    ScheduledUpdateTopicWorkflow,
    CreateScheduleWorkflow,
    DeleteScheduleWorkflow,
    ReplyToMessageWorkflow,
  ],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "channels:join",
    "channels:manage",
    "channels:history",
    "groups:write",
    "im:write",
    "im:history",
    "mpim:write",
    "chat:write",
    "chat:write.public",
    "triggers:write",
    "triggers:read",
  ],
});
