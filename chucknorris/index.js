"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
require("./cmds/botCmds.js");
require("dotenv/config");
require("./utils/translations/translator");
const botCmds_js_1 = require("./cmds/botCmds.js");
const langs = require("langs");
var prod = false;
var token;
let currentLanguage = "en";
if (process.env["TELEGRAM_BOT_TOKEN"]) {
    prod = true;
    token = process.env["TELEGRAM_BOT_TOKEN"];
}
else if (process.env["TELEGRAM_BOT_TOKEN_DEV"]) {
    token = process.env["TELEGRAM_BOT_TOKEN_DEV"];
}
else {
    throw new Error("Token not defined");
}
const bot = new telegraf_1.Telegraf(token, { telegram: { webhookReply: true } });
if (process.env["WEBHOOK_ADDRESS"] === undefined) {
    throw new Error("Webhook not defined");
}
else {
    const url = process.env["WEBHOOK_ADDRESS"];
    bot.telegram.setWebhook(url);
}
(0, botCmds_js_1.setupBotCommands)(bot);
bot.launch();
const httpFunction = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const update = JSON.parse(req.rawBody);
            bot.handleUpdate(update).catch((error) => {
                console.log("Error processing update");
                console.log(error);
            });
        }
        catch (error) {
            console.error("Error parsing body", error);
            return (context.res = {
                status: 400,
                body: "",
            });
        }
    });
};
if (!prod) {
    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
exports.default = httpFunction;
