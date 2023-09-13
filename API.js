/**
 * Cohere AI API Text Classification
 * ---------------------------------
 * This script interacts with the Cohere AI API to classify an array of input text examples using
 * the `classifyArr` function. It sends a POST request to the API with the input text array and
 * a set of predefined examples to perform the classification. The response from the API is logged
 * to the console.
 */

/**
 * Predefined Examples for Classification
 * --------------------------------------
 * @constant {Array} examples - An array of examples for text classification. The examples should
 * consist of objects with `text` and `label` properties, where `text` is the example text and
 * `label` is the corresponding classification label (e.g., "Toxic", "Benign").
 * Note: The provided code snippet is empty for the `examples` array. For actual use, you should
 * fill it with representative examples for classification based on your specific needs.
 */
const examples = [
  // Fill this array with examples for text classification
  // Example format: { text: "Example text here", label: "Classification Label" }
];

/**
 * classifyArr Function
 * --------------------
 * This asynchronous function performs text classification using the Cohere AI API.
 * It sends a POST request to the API with the inputArr, which is an array of input text examples
 * to be classified. It also includes the `examples` array of predefined examples for classification.
 * The function returns the response from the API, which contains the classification results.
 * @param {string[]} inputArr - An array of input text examples to be classified.
 * @returns {Promise<Object>} A Promise that resolves with the classification response from the API.
 */
async function classifyArr(inputArr) {
  // var res;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer ...", // API KEY
    },
    body: JSON.stringify({
      inputs: inputArr,
      examples: examples,
      truncate: "END",
      model: "large",
    }),
  };
  // console.log(options);
  let res = await fetch("https://api.cohere.ai/v1/classify", options)
    // .then(response => res = response.json())
    .then((response) => console.log(response));
  // .catch(err => console.error(err))
  return res.json();
}

// Example input array for text classification
const input = [
  "this game sucks, you suck",
  "stop being horrible",
  "Let's do this once and for all",
  "This is coming along nicely",
];

// console.log(input);

// Call classifyArr function with the input array and log the response
const x = classifyArr(input);
