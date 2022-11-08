# Daily Topic Bot

This repo is a starter template exemplifying a bot that runs on a schedule to update channel topics and replies to user messages in thread. If you need a refresh on Platform 2.0, please check out the [Concepts and FAQ Section](https://slack-github.com/slack-services/Daily-Topic-Bot#Platform-2.0-Concepts-and-FAQ)

## Use Case and Deployment
https://media.slack-github.com/user/2725/files/4e5a968c-380e-40df-8af9-b73ab160e4fe

## Setup

If you have not yet installed your Slack CLI, please see the [Prerequisites section](https://slack-github.com/slack-services/Daily-Topic-Bot#Prerequisites)

### Workspace Deploy
Clone this repo and navigate to it in Terminal. 

Deploy it using 
```zsh
$ slack deploy
```

### Triggers

#### Trigger Configuration
Prior to creating your triggers, open /triggers/message_posted_event.ts. Update the Channel_ids property and overwrite the "REPLACE_WITH_YOUR_CHANNEL_ID" value to be the ChannelId of the channel you want your bot to respond in

#### Static Trigger Creation
You will need to create the triggers that will act as entrypoints into your workflows. Most are created during installation. You can deploy all of them by running 
```zsh
$ for x in triggers/*.json ; do slack triggers create --trigger-def $x; done
```
or you can do so individually using
```zsh
$ slack triggers create --trigger-def triggers/[file_name].json
```

#### Dynamic Trigger Creation
Daily Topic Bot allows you to create daily schedules for any channel in your workspace. After you've created your static triggers, be sure to run the Create a Schedule trigger for any channels you'd like to see updated

#### Trigger Deletion
Triggers are not updated when you deploy your app. If you update and recreate a trigger, it adds a new entry and does not update the existing one. To delete triggers, run
```zsh
$ slack triggers
```
to get a list of them and
```zsh
$ slack triggers delete --trigger-id [Trigger_Id]
```
to delete individual entries.

If you want to delete all your triggers
```zsh
$ slack uninstall
```
removes your app from the workspace and all triggers associated with it. Be warned that your App Id will be different on your next deploy and that this command also deletes all Datastore entries associated with the app as well

# Platform 2.0 Concepts and FAQ

## Prerequisites

To use this template, you will need to have installed and configured the Slack CLI. 
Do this by following our [Quickstart Guide](https://api.slack.com/future/quickstart).

# Making an app

Make a Run On Slack app with this with repo by **creating an app from this template**, 
**configuring your app**, then **writing functions**. 

Once you're done, you can Run your app with the CLI's local development server
or Deploy your app to production.

## 1. Creating an app from this template

Clone this repo with the Slack CLI:

```zsh
$ slack create my-app -t slack-samples/deno-starter-template
```

## 2. Configuring your app

The first thing we'll do is configure our app's manifest. This will let us 
configure things like our app's name and the [scopes](https://api.slack.com/scopes)
it requires.

Enter your project's root directory:

```zsh
$ cd my-app
```

Next, open the manifest file, `manifest.ts`. 

In the `Manifest` configuration, set your app's `name` and `description`:

```ts
export default Manifest({
  name: "starter-template", // Change this
  description: "A starter template.", // Change this
  icon: "assets/icon.png",
  functions: [],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
```

## 3. Writing functions

On our [next-generation platform](https://api.slack.com/future), you can 
build **Run On Slack functions**, reusable building blocks of automation 
that are deployed to Slack and accept inputs, perform some calculations, 
and provide outputs. 

Functions can be triggered via Global Shortcut, and we'll be adding support 
for more function and trigger types in the coming months.

To create a Run On Slack function:

* **define** the function in the Manifest, then 
* **implement** the function in its respective source file.

### 3.a. Define your function

In your `manifest.ts` file, define a function with `DefineFunction` like this:

```ts
const MyFunction = DefineFunction({
  callback_id: "a_unique_callback_id", 
  title: "Do Something",        
  description: "A short, helpful sentence about your app.",
  source_file: "functions/my_function.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {},
    required: [],
  }
});
```

<details>
<summary>Deep dive into function definitions</summary>

Let's look at each property in detail:

* **`callback_id` is a unique string identifier.** This is used internally, 
  and also for raising issues about this function.
* **`title` is how others will see your function.** For example, if you have a 
  Global shortcut function `GetCustomerProfileFunction`, you might set your `callback_id` to be `get_customer_profile_function`.
* **`description` is a succinct summary of what your function does.**
* **`source_file` is where your function is implemented,** relative to the root of
  your project. 
* **`input_parameters` is where you configure your function's inputs.**
* **`output_parameters` is where you configure your function's outputs.**

Both `input_parameters` and `output_parameters` can be an object with further 
sub-properties:
  
* `type` is the type of the input parameter. The supported types are string, boolean, object, and array. Support for more types coming soon.
* `description` is a string description of the input parameter.

Define inputs to and outputs for your functions in the `properties` of `input_parameters` and `output_parameters`, respectively, like this:

```ts
parameterName: {
  type: Schema.type.string, // See more supported types below
  description: "A short description"
}
```

For example, let's say you want to create a function that takes two string 
inputs, `firstName` and `lastName`, and produces a string output 
called `fullName`. Your function definition might look something like this:

```js
const GetCustomerFullName = DefineFunction({
  callback_id: "get_customer_full_name", 
  title: "Get Customer Full Name",        
  description: "Given a first and last name, returns the full name.",
  source_file: "functions/get_customer_full_name.ts",
  input_parameters: {
    properties: {
      firstName: {
        type: Schema.types.string,
        description: "The customer's first name"
      },
      lastName: {
        type: Schema.types.string,
        description: "The customer's last name"
      }
    },
    required: []
  },
  output_parameters: {
    properties: {
      fullName: {
        type: Schema.types.string,
        description: "The customer's full name"
      }
    },
    required: []
  }
});
```

If you want to set a property as required, list its name in its 
respective `required` property.

For example, if you have an input parameter named `customer_id` that you 
want to be required, you can do so like this:

```js
input_parameters: {
  properties: {
    customer_id: {
      type: Schema.types.string,
      description: "The customer's ID"
    }
  },
  required: ["customer_id"]
}
```

</details>

### 3.b. Implement your function

With your function defined in the manifest file, you can now implement your 
function in its respective source file. 

Create a file with a name corresponding to your function's name:

```zsh
$ touch functions/my_function.ts
```

In your function's source file, use one of the following templates to 
implement your function:

<details>
<summary>Function template</summary>

```ts
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";

// Import your function's definition here
import type { MyFunction } from "../manifest.ts";

// Construct your Slack function handler, using your function's definition 
// to enforce input and output requirements:
const myFunction: SlackFunctionHandler<typeof MyFunction.definition> = (
  { inputs, env },
) => {
  return {
    outputs: {},
  };
};

export default myFunction;
```

</details>

<details>
<summary>Async function template</summary>

```ts
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";

// Import your function's definition here
import type { MyFunction } from "../manifest.ts";

// Construct your Slack function handler, using your function's definition 
// to enforce input and output requirements:
const myFunction: SlackFunctionHandler<typeof MyFunction.definition> = async (
  { inputs, env },
) => {
  return await {
    outputs: {},
  };
};

export default myFunction;
```

</details>

A function's implementation must be the default export of the source file. 
When instantiating the function, use `SlackFunctionHandler` and pass 
in your function's `.definition` so that your required inputs and outputs will be 
enforced. 

## Running your app locally

While building your app, you can see your changes propagated to your 
workspace in real-time with `slack run`.

Executing `slack run` starts a local development server, syncing changes to 
your workspace's development version of your app. (You'll know it's the 
development version because the name has the string `(dev)` appended).

Your local development server is ready to go when you see the following:

```zsh
Connected, awaiting events

```

When you want to turn off the local development server, use `Ctrl+c` in the command prompt.


## Deploying your app to Slack

When you're done developing your app, you can deploy it directly to Slack 
with `slack deploy`.
