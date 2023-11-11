import axios from "axios";
import cheerio from "cheerio";

const axiosConfig = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  },
};

export async function getChuckNorrisJokeByNumber(jokeNumber: number) {
  if (isNaN(jokeNumber) || jokeNumber < 1 || jokeNumber > 100) {
    return "Invalid joke number. Please provide a number between 1 and 101.";
  }

  try {
    const url =
      "https://www.hellaentertainment.com/blog/celebrities/80-chuck-norris-jokes-for-his-80th-birthday/";
    const response = await axios.get(url, axiosConfig);
    const $ = cheerio.load(response.data);

    // Find the HTML element that contains the Chuck Norris jokes
    const jokesContainer = $(".entry-content");

    // Extract the text of the jokes
    const jokes: String[] = [];

    // Chuck Norris jokes are in <li> elements on the page
    jokesContainer.find("li").each((index, joke) => {
      jokes.push($(joke).text());
    });

    if (jokeNumber > 0 && jokeNumber <= jokes.length) {
      return jokes[jokeNumber - 1];
    } else {
      throw new Error("Joke not found");
    }
  } catch (error: any) {
    console.log(error.Error);
  }
}
