# Run-on-Slack Deno Daily Topic Bot

This app contains a sample TypeScript project for use on Slack's
[next-generation hosted platform](https://api.slack.com/future). The sample
features a bot that runs on a schedule to update channel topics and replies to
user messages in thread. Event triggers can be dynamically created by the app to
allow it to work with new channels.

**Guide Outline**:

- [Supported Workflows](#supported-workflows)
- [Setup](#setup)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Clone the Sample App](#clone-the-sample-app)
- [Create a Link Trigger](#create-a-link-trigger)
- [Running Your Project Locally](#running-your-project-locally)
- [Testing](#testing)
- [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
- [Project Structure](#project-structure)
- [Resources](#resources)

---

## Supported Workflows

- **Update Topic**: A manually triggered workflow to demonstrate updating a
  channel's topic.
- **Scheduled Update Topic**: An automatically triggered workflow that updates a
  channel's topic.
- **Create Schedule**: Set up a daily topic update for a channel.
- **Delete Schedule**: Remove a daily topic update for a channel.
- **Reply To Message**: A workflow that replies to the first message of a thread
  in a new channel with the daily message.

## Setup

Before getting started, make sure you have a development workspace where you
have permissions to install apps. If you don’t have one set up, go ahead and
[create one](https://slack.com/create). Also, please note that the workspace
requires any of [the Slack paid plans](https://slack.com/pricing).

### Install the Slack CLI

To use this sample, you first need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/future/quickstart).

### Clone the Sample App

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-daily-topic-bot -t slack-samples/deno-daily-channel-topic

# Change into this project directory
$ cd my-daily-topic-bot
```

## Create a Link Trigger

[Triggers](https://api.slack.com/future/triggers) are what cause workflows to
run. These triggers can be invoked by a user, or automatically as a response to
an event within Slack.

A [link trigger](https://api.slack.com/future/triggers/link) is a type of
trigger that generates a **Shortcut URL** which, when posted in a channel or
added as a bookmark, becomes a link. When clicked, the link trigger will run the
associated workflow.

Link triggers are _unique to each installed version of your app_. This means
that Shortcut URLs will be different across each workspace, as well as between
[locally run](#running-your-project-locally) and
[deployed apps](#deploying-your-app). When creating a trigger, you must select
the Workspace that you'd like to create the trigger in. Each workspace has a
development version (denoted by `(dev)`), as well as a deployed version.

### Trigger Configuration

Prior to creating your triggers, open `/triggers/message_posted_event.ts`.
Update the Channel_ids property and overwrite the "REPLACE_WITH_YOUR_CHANNEL_ID"
value to be the channel ID of the channel you want your bot to respond in.

### Static Trigger Creation

You will need to create the triggers that will act as entrypoints into your
workflows. Most are created during installation. You can deploy all of them by
running

```zsh
$ for x in triggers/*.ts ; do slack triggers create --trigger-def $x; done
```

or you can do so individually using

```zsh
$ slack triggers create --trigger-def triggers/[file_name].ts
```

### Dynamic Trigger Creation

Daily Topic Bot allows you to create daily schedules for any channel in your
workspace. After you've created your static triggers, be sure to run the Create
a schedule trigger for any channels you'd like to see updated

After selecting a Workspace, the output provided will include the link trigger
Shortcut URL. Copy and paste this URL into a channel as a message, or add it as
a bookmark in a channel of the Workspace you selected.

**Note: this link won't run the workflow until the app is either running locally
or deployed!** Read on to learn how to run your app locally and eventually
deploy it to Slack hosting.

### Trigger Setup Demonstration:

https://user-images.githubusercontent.com/3172461/204366766-e99c8b15-8d7a-4e83-aacc-1588eb3b2d24.mp4

## Running Your Project Locally

While building your app, you can see your changes propagated to your workspace
in real-time with `slack run`. In both the CLI and in Slack, you'll know an app
is the development version if the name has the string `(dev)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

Once running, click the
[previously created Shortcut URL](#create-a-link-trigger) associated with the
`(dev)` version of your app. This should start a workflow that opens a form,
which will trigger your topic update.

To stop running locally, press `<CTRL> + C` to end the process.

## Testing

For an example of how to test a function, see `functions/daily_message_test.ts`.
Test filenames should be suffixed with `_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```

## Deploying Your App

Once you're done with development, you can deploy the production version of your
app to Slack hosting using `slack deploy`:

```zsh
$ slack deploy
```

After deploying, [create a new link trigger](#create-a-link-trigger) for the
production version of your app (not appended with `(dev)`). Once the trigger is
invoked, the workflow should run just as it did in when developing locally.

### Viewing Activity Logs

Activity logs for the production instance of your application can be viewed with
the `slack activity` command:

```zsh
$ slack activity
```

## Project Structure

### `manifest.ts`

The [app manifest](https://api.slack.com/future/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

### `/functions`

[Functions](https://api.slack.com/future/functions) are reusable building blocks
of automation that accept inputs, perform calculations, and provide outputs.
Functions can be used independently or as steps in workflows.

### `/workflows`

A [workflow](https://api.slack.com/future/workflows) is a set of steps that are
executed in order. Each step in a workflow is a function.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/future/forms) before continuing
to the next step.

### `/triggers`

[Triggers](https://api.slack.com/future/triggers) determine when workflows are
executed. A trigger file describes a scenario in which a workflow should be run,
such as a user pressing a button or when a specific event occurs.

## Resources

To learn more about developing with the CLI, you can visit the following guides:

- [Creating a new app with the CLI](https://api.slack.com/future/create)
- [Configuring your app](https://api.slack.com/future/manifest)
- [Developing locally](https://api.slack.com/future/run)

To view all documentation and guides available, visit the
[Overview page](https://api.slack.com/future/overview).
