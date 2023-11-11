import { Telegraf } from "telegraf";
import { getChuckNorrisJokeByNumber } from "../utils/scraping/scraping";
import {
  translateText,
  getAzureLanguageCode,
} from "../utils/translations/translator";

const messages = {
  start: "Welcome to the Chuck Norris bot!",
};

let currentLanguage = "en";

export function setupBotCommands(bot: any): void {
  bot.hears(/info/, async (ctx: any) => {
    ctx.reply(`The current language is ${currentLanguage}`);
  });

  bot.hears(/change language (.+)/i, async (ctx: any) => {
    const requestedLanguage = ctx.match[1];
    const languageBeforeChange = currentLanguage;
    let replyString;
    currentLanguage = getAzureLanguageCode(requestedLanguage);
    if (currentLanguage === "unsupported") {
      currentLanguage = languageBeforeChange;
      replyString =
        (await translateText(
          "You have chosen an unsupported language: ",
          currentLanguage
        )) + `${requestedLanguage}`;
    } else {
      replyString = await translateText("No problem.", currentLanguage);
    }
    ctx.reply(replyString);
  });

  bot.hears(/^\d+$/, async (ctx: any) => {
    const jokeNumber = ctx.message.text;
    const joke: any = await getChuckNorrisJokeByNumber(parseInt(jokeNumber));
    const translatedJoke = await translateText(joke, currentLanguage);

    ctx.reply(translatedJoke);
  });

  // Logging
  bot.use((ctx: any, next: any) => {
    console.log(ctx.from);
    console.log("Message from: " + ctx?.from?.username);
    return next();
  });

  bot.start((ctx: any) => ctx.reply(messages.start));

  bot.catch((err: any) => {
    console.log("Unexpected error: ", err);
  });
}
