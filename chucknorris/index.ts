import { Telegraf } from "telegraf";
import { AzureFunction } from "@azure/functions";
import axios, { AxiosResponse } from "axios";
import "./cmds/botCmds.js";
import "dotenv/config";
import "./utils/translations/translator";
import { getChuckNorrisJokeByNumber } from "./utils/scraping/scraping.js";
import {
  getAzureLanguageCode,
  translateText,
} from "./utils/translations/translator";
import { setupBotCommands } from "./cmds/botCmds.js";
const langs = require("langs");

var prod = false;
var token: string;

let currentLanguage = "en";

if (process.env["TELEGRAM_BOT_TOKEN"]) {
  prod = true;
  token = process.env["TELEGRAM_BOT_TOKEN"];
} else if (process.env["TELEGRAM_BOT_TOKEN_DEV"]) {
  token = process.env["TELEGRAM_BOT_TOKEN_DEV"];
} else {
  throw new Error("Token not defined");
}

const bot = new Telegraf(token, { telegram: { webhookReply: true } });

if (process.env["WEBHOOK_ADDRESS"] === undefined) {
  throw new Error("Webhook not defined");
} else {
  const url = process.env["WEBHOOK_ADDRESS"];
  bot.telegram.setWebhook(url);
}

setupBotCommands(bot);

bot.launch();

const httpFunction: AzureFunction = async function (context, req) {
  try {
    const update = JSON.parse(req.rawBody);

    bot.handleUpdate(update).catch((error) => {
      console.log("Error processing update");
      console.log(error);
    });
  } catch (error) {
    console.error("Error parsing body", error);
    return (context.res = {
      status: 400,
      body: "",
    });
  }
};

if (!prod) {
  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

export default httpFunction;
