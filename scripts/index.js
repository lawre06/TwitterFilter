/**
 * Twitter Toxicity Filter
 * ----------------------
 * This script allows filtering toxic tweets on the Twitter website by applying a blur effect
 * to the toxic tweets. It uses the MutationObserver API to detect changes in the DOM, specifically
 * when new tweets are added to the feed, and checks the text content of each tweet against a
 * predefined set of toxic and benign examples using the Cohere AI API for classification.
 *
 * Features:
 *  - Detects and filters toxic tweets by applying a blur effect to them.
 *  - Uses Cohere AI API for tweet classification.
 *  - Allows turning the filter on and off using a Chrome extension.
 *
 * Requirements:
 *  - The script requires access to the Cohere AI API with a valid bearer token for classification.
 *  - It should be used as a content script in a Chrome extension, listening to the 'onMessage' event
 *    to toggle the filtering behavior.
 *
 * Usage:
 *  - The script should be injected into the Twitter website's DOM via the Chrome extension.
 *  - It starts filtering tweets immediately upon injection.
 *  - The filtering can be toggled on and off by sending a message to the extension.
 *  - When a tweet is classified as toxic, it gets blurred using the 'filter' CSS property.
 *  - When the filtering is turned off, the blur effect is removed from all tweets.
 */

/**
 * Global Variables
 * ----------------
 * @var {boolean} on - Represents the current state of the filtering. When true, filtering is active.
 */
var on = true;

/**
 * Observer Configuration
 * ----------------------
 * @constant {Object} observer - The MutationObserver instance that watches for changes in the DOM.
 */
const observer = new MutationObserver(callback);

/**
 * MutationObserver Callback
 * -------------------------
 * This function is called whenever the MutationObserver detects changes in the DOM.
 * It iterates through newly added tweets, extracts their text content, and performs toxicity
 * classification using the Cohere AI API. If a tweet is classified as toxic, it gets blurred.
 * @param {MutationRecord[]} mutations - An array of MutationRecord objects representing changes in the DOM.
 */
function callback(mutations) {
  if (on === true) {
    let tweets = document.querySelectorAll("[data-testid='cellInnerDiv']");
    const tweetArr = [];
    for (let tweet of tweets) {
      tweetText = tweet.querySelector("[data-testid='tweetText']");
      if (tweetText != null) {
        // console.log(tweetText);
        tweetArr.push(tweetText.innerText);
        var text = "Toxic statement";

        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization: "Bearer ...",
          },
          body: JSON.stringify({
            inputs: [tweetText],
            examples: [
              {
                text: "Warning to all people: keep your social distancing from me",
                label: "Toxic",
              },
              { text: "Chelsea is just a bunch of losers", label: "Benign" },
              {
                text: "piece of junk is what this is, doesn't work at all",
                label: "Benign",
              },
              // fill with examples of toxic and benign tweets / phrases
            ],
            truncate: "END",
            model: "large",
          }),
        };

        fetch("https://api.cohere.ai/v1/classify", options)
          .then((response) => response.json())
          .then((response) => classify(response))
          .catch((err) => console.error(err));

		/**
		 * classify Function
		 * -----------------
		 * This function processes the response from the Cohere AI API classification.
		 * If the tweet is classified as "Toxic," it applies a blur effect to the corresponding tweet element.
		 * @param {Object} response - The response object from the Cohere AI API containing tweet classifications.
		 */
        function classify(x) {
          console.log(x.classifications[0].prediction);
          if (x.classifications[0].prediction === "Toxic") {
            tweet.style.filter = "blur(1.5rem)";
          }
        }
      }

      // tweet.style.filter = 'blur(1.5rem)';
    }
  }
}

/**
 * Content Script Initialization
 * -----------------------------
 * The script starts observing changes in the DOM once injected into the Twitter website.
 * It observes the "react-root" element, which contains the Twitter feed.
 */
observer.disconnect();
observer.observe(document.getElementById("react-root"), {
  childList: true,
  subtree: true,
});

/**
 * Chrome Extension Message Listener
 * ----------------------------------
 * Listens for messages from the Chrome extension to toggle the filtering behavior.
 * If the message is "ON," the filtering is turned on, and the callback function is executed.
 * If the message is anything else, the filtering is turned off, and the blur effect is removed
 * from all tweets.
 * @param {Object} request - The message object received from the extension.
 * @param {Object} sender - Information about the sender of the message (e.g., extension id).
 * @param {Function} sendResponse - A callback function to send a response back to the extension.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log("HERE");
  if (request.message === "ON") {
    on = true;
    callback();
  } else {
    on = false;
    let tweets = document.querySelectorAll("[data-testid='cellInnerDiv']");
    for (let tweet of tweets) {
      tweet.style.filter = "blur(0)";
    }
  }
});
