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
exports.setupBotCommands = void 0;
const scraping_1 = require("../utils/scraping/scraping");
const translator_1 = require("../utils/translations/translator");
const messages = {
    start: "Welcome to the Chuck Norris bot!",
};
let currentLanguage = "en";
function setupBotCommands(bot) {
    bot.hears(/info/, (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.reply(`The current language is ${currentLanguage}`);
    }));
    bot.hears(/change language (.+)/i, (ctx) => __awaiter(this, void 0, void 0, function* () {
        const requestedLanguage = ctx.match[1];
        const languageBeforeChange = currentLanguage;
        let replyString;
        currentLanguage = (0, translator_1.getAzureLanguageCode)(requestedLanguage);
        if (currentLanguage === "unsupported") {
            currentLanguage = languageBeforeChange;
            replyString =
                (yield (0, translator_1.translateText)("You have chosen an unsupported language: ", currentLanguage)) + `${requestedLanguage}`;
        }
        else {
            replyString = yield (0, translator_1.translateText)("No problem.", currentLanguage);
        }
        ctx.reply(replyString);
    }));
    bot.hears(/^\d+$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
        const jokeNumber = ctx.message.text;
        const joke = yield (0, scraping_1.getChuckNorrisJokeByNumber)(parseInt(jokeNumber));
        const translatedJoke = yield (0, translator_1.translateText)(joke, currentLanguage);
        ctx.reply(translatedJoke);
    }));
    // Logging
    bot.use((ctx, next) => {
        var _a;
        console.log(ctx.from);
        console.log("Message from: " + ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _a === void 0 ? void 0 : _a.username));
        return next();
    });
    bot.start((ctx) => ctx.reply(messages.start));
    bot.catch((err) => {
        console.log("Unexpected error: ", err);
    });
}
exports.setupBotCommands = setupBotCommands;
