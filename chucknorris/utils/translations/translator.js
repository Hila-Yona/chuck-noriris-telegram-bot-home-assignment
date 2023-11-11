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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = exports.getAzureLanguageCode = void 0;
const axios_1 = __importDefault(require("axios"));
const langs = require("langs");
const capitalizeFirstLetter = (input) => input.charAt(0).toUpperCase() + input.slice(1);
function getAzureLanguageCode(language) {
    language = capitalizeFirstLetter(language);
    const languageInfo = langs.where("name", language);
    if (!languageInfo) {
        return "unsupported";
    }
    return languageInfo["1"];
}
exports.getAzureLanguageCode = getAzureLanguageCode;
function translateText(text, targetLanguage) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscriptionKey = "bb31a1602d2944cda55991882e203f1d";
        const endpoint = "https://api.cognitive.microsofttranslator.com/";
        const translateUrl = `${endpoint}/translate?api-version=3.0&to=${targetLanguage}`;
        try {
            const response = yield axios_1.default.post(translateUrl, [{ text: text }], {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": subscriptionKey,
                    "Ocp-Apim-Subscription-Region": "eastus",
                    charset: "utf8",
                },
            });
            console.log(response.data[0].translations[0].text);
            return response.data[0].translations[0].text;
        }
        catch (error) {
            console.error("Error making translation request:", error.response ? error.response.data : error.message);
            throw error;
        }
    });
}
exports.translateText = translateText;
