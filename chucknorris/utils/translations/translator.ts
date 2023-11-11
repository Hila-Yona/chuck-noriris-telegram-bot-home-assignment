import axios, { AxiosResponse } from "axios";
const langs = require("langs");

const capitalizeFirstLetter = (input: string): string =>
  input.charAt(0).toUpperCase() + input.slice(1);

export function getAzureLanguageCode(language: string): string {
  language = capitalizeFirstLetter(language);

  const languageInfo = langs.where("name", language);

  if (!languageInfo) {
    return "unsupported";
  }

  return languageInfo["1"];
}

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const subscriptionKey = "bb31a1602d2944cda55991882e203f1d";
  const endpoint = "https://api.cognitive.microsofttranslator.com/";

  const translateUrl = `${endpoint}/translate?api-version=3.0&to=${targetLanguage}`;

  try {
    const response: AxiosResponse = await axios.post(
      translateUrl,
      [{ text: text }],
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": "eastus",
          charset: "utf8",
        },
      }
    );

    console.log(response.data[0].translations[0].text);

    return response.data[0].translations[0].text;
  } catch (error: any) {
    console.error(
      "Error making translation request:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
