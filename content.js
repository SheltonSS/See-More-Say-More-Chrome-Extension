// require('dotenv').config();
// const apiKey = process.env.API_KEY;

let currentLanguage = "en"; // Default language is English
let base_language = "fr";
let studykey = "Study";
// Example code in content.js or your UI script
let boxcnt = 0;

//sets the lang (ex input: en(english),fr(french),es(spanish)) + starts translating the page
function setLanguage(language) {
  base_language = currentLanguage;
  currentLanguage = language;
  // console.log(translateSentence(sentenceToTranslate, targetLanguage));
  startTranslation();
}
// translates changes to page
async function translateTextNode(textNode) {
  const key =  "f8a729fefc4d4f25a7285f4578b74d29"; // Replace with your actual API key
  const location = "eastus";
  const originalText = textNode.nodeValue.trim();

  if (originalText !== "") {
    const response = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${base_language}&to=${currentLanguage}`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": location,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: originalText }]),
      }
    );

    // console.log(response.ok);

    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse);

      const translatedText = jsonResponse[0].translations[0].text;
      textNode.nodeValue = textNode.nodeValue.replace(
        originalText,
        translatedText
      );
      // console.log(originalText);
      // console.log(translatedText);
    } else {
      console.error("Translation failed:", response.statusText);
    }
  }
}
//observe mutations/translteTextNode helper function
function observeMutations() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          // Check if the node has a class that excludes translation
          if (!node.classList.contains("no-translate")) {
            if (node.nodeType === Node.TEXT_NODE) {
              translateTextNode(node, currentLanguage);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                null,
                false
              );

              while (walker.nextNode()) {
                translateTextNode(walker.currentNode, currentLanguage);
              }
            }
          }
        });
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}
//strats the procces of transling by translating the current page and then calling translateTextNode
function startTranslation() {
  // console.log("Translate existing content");
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (textNodes.nextNode()) {
    translateTextNode(textNodes.currentNode);
  }
  // console.log("Translate mutations");

  observeMutations();
}
//listner for the buttons
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "translate") {
    setLanguage("fr");
    console.log(`${base_language} -> ${currentLanguage}`);
  } else if (request.action === "English_Translate") {
    setLanguage("en");
    console.log(`${base_language} -> ${currentLanguage}`);
  } else if (request.action === "Spanish_Translate") {
    setLanguage("es");
    console.log(`${base_language} -> ${currentLanguage}`);
  }
});

// listner for the highlighted text
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.selectedText) {
    selectedText = message.selectedText;
    if (message.action === "translateBTB") {
      translatedText = await translateSentence(selectedText);
      spawnBox(translatedText);
    } else if (message.action === "Store") {
      console.log(selectedText);
      const translated_sentence = await translateSentence(selectedText);

      // Define variables outside the if statement
      let studykey, storedSentence;

      // Store text
      if ((currentLanguage == "en")) {
        studykey = selectedText; // the word in another language
        storedSentence = translated_sentence;
      } else {
        studykey = translated_sentence; // the word in learning lang
        storedSentence = selectedText;
      }

      // Save to local storage
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ [studykey]: storedSentence }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            console.log("Data saved to local storage");
            resolve();
          }
        });
      });

      // Display notification box
      spawnBox("Added to your study book");

      // Log all data from local storage
      const data = await getAllDataFromLocalStorage();
      console.log("All data from local storage:", data);
    } else if (message.action === "In_a_Sentence") {
      // console.log(message.selectedText);
      // console.log(translateSentence(message.selectedText,"en"));
    } else if (message.action === "clear_local_storage") { 
      chrome.storage.local.clear(function() {
        console.log('Local storage cleared');
      });
    }
  }
});

//spawn infobox
function spawnBox(txttodisplay) {
  // div element for the box
  const box = document.createElement("div");

  // Style
  box.style.position = "fixed";
  box.style.bottom = "5px"; //  bottom position
  box.style.right = "10px"; //  right position

  // max width
  const maxWidth = 300; // Change the maximum width as needed
  box.style.maxWidth = maxWidth + "px";

  // default height
  let defaultHeight = 25;

  // span element creation for the text with a specified color
  const spanElement = document.createElement("span");
  spanElement.style.color = "white"; //  color of txt

  // Create a text node and append it to the span
  const textNode = document.createTextNode(txttodisplay); // txt content
  spanElement.appendChild(textNode);

  // Append the text node to the box
  box.appendChild(spanElement);
  // Append the box to the body of the document
  box.classList.add("no-translate"); // Add class to exclude from translation
  document.body.appendChild(box);

  //  height based on content
  const textHeight = spanElement.offsetHeight;
  const boxHeight = Math.max(defaultHeight, textHeight);

  // Style w/ dynamic dimensions
  box.style.width = "auto"; //  width based on content
  box.style.height = boxHeight + "px"; // height based on content
  box.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red with 50% transparency

  // hide the box after 3 seconds
  setTimeout(function () {
    box.style.display = "none";
  }, 3000);
}

//translate a sentence/word
async function translateSentence(sentence) {
  const key =  "f8a729fefc4d4f25a7285f4578b74d29";
  const location = "eastus";
  const response = await fetch(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${currentLanguage}&to=${base_language}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: sentence }]),
    }
  );
  if (response.ok) {
    const jsonResponse = await response.json();
    const translatedText = jsonResponse[0].translations[0].text;
    console.log("Original sentence:", sentence);
    console.log("Translated sentence:", translatedText);
    // spawnBox(translatedText);
    return translatedText;
  } else {
    // console.error("Translation failed. HTTP status code:", response.status);
    const errorBody = await response.text();
    // console.error("Error response body:", errorBody);
    return null;
  }
}

//openai example sentence ======================================================================================= dosent work- have to sign up for openai api key

//azure txttospeach =========================================================================== doesnt work wont play sound
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("playing sound blob");
//   if (request.type === "playAudio") {
//     const audioUrl = URL.createObjectURL(request.audioBlob);
//     const audio = new Audio(audioUrl);
//     audio.play();

//     // const audio = new Audio(request.audioDataUrl);
//     // audio.play();
//     console.log("succesfully played sound");
//   }
// });

//storage study system================================================================
// Function to get all data from local storage
function getAllDataFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}
// Example usage
// getAllDataFromLocalStorage().then((data) => {
//   console.log("All data from local storage:", data);
// }).catch((error) => {
//   console.error("Error retrieving data from local storage:", error);
// });
