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
exports.getChuckNorrisJokeByNumber = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const axiosConfig = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    },
};
function getChuckNorrisJokeByNumber(jokeNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isNaN(jokeNumber) || jokeNumber < 1 || jokeNumber > 100) {
            return "Invalid joke number. Please provide a number between 1 and 101.";
        }
        try {
            const url = "https://www.hellaentertainment.com/blog/celebrities/80-chuck-norris-jokes-for-his-80th-birthday/";
            const response = yield axios_1.default.get(url, axiosConfig);
            const $ = cheerio_1.default.load(response.data);
            // Find the HTML element that contains the Chuck Norris jokes
            const jokesContainer = $(".entry-content");
            // Extract the text of the jokes
            const jokes = [];
            // Chuck Norris jokes are in <li> elements on the page
            jokesContainer.find("li").each((index, joke) => {
                jokes.push($(joke).text());
            });
            if (jokeNumber > 0 && jokeNumber <= jokes.length) {
                return jokes[jokeNumber - 1];
            }
            else {
                throw new Error("Joke not found");
            }
        }
        catch (error) {
            console.log(error.Error);
        }
    });
}
exports.getChuckNorrisJokeByNumber = getChuckNorrisJokeByNumber;
