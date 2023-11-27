let currentLanguage = "en"; // Default language is English
let base_language = "en";
let studykey = "Study"; 
// let value = "Value"
//sets the lang (ex input: en(english),fr(french),es(spanish)) + starts translating the page
function setLanguage(language) {
  base_language = currentLanguage;
  currentLanguage = language;
  // console.log(translateSentence(sentenceToTranslate, targetLanguage));
  startTranslation();
}
// translates changes to page
async function translateTextNode(textNode) {
  const key = "f8a729fefc4d4f25a7285f4578b74d29"; // Replace with your actual API key
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.selectedText) {
    if (message.action === "translateBTB") {
      console.log(message.selectedText);
      console.log(translateSentence(message.selectedText, "en"));

    } else if (message.action === "Store") {
      console.log(message.selectedText);
      // Store text
      chrome.storage.local.set({ studykey: message.selectedText }, function() {
        console.log('Data saved to local storage');
      });

      
    } else if (message.action === "In_a_Sentence") {
      // console.log(message.selectedText);
      // console.log(translateSentence(message.selectedText,"en"));
    }
  }
});

// function translateSelectedText(selectedText) {
//   // Implement translation logic for the selected text as needed
//   console.log(`Translating selected text: ${selectedText}`);
//   // You can use the translateTextNode function or any other logic here
// }
//PT2 translate highlighted text to base languge (English for example)===============================================================
//Attempt 3==============
// Function to handle the context menu item click

// Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("waiting for request ");

//   if (request.action === "translateText") {
//     console.log("request reiceverd ");
//     // Handle translation of selected text
//     translateSelectedText(request.selectedText);
//   }
// });

//Attempt 2==================
// // Function to translate highlighted text back to English
// async function translateBackToEnglish(highlightedText) {
//   console.log("back to english...");
//   const key = "f8a729fefc4d4f25a7285f4578b74d29"; // Replace with your actual API key
//   const location = "eastus";

//   const response = await fetch(
//     `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${currentLanguage}&to=${base_language}`,
//     {
//       method: "POST",
//       headers: {
//         "Ocp-Apim-Subscription-Key": key,
//         "Ocp-Apim-Subscription-Region": location,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify([{ Text: highlightedText }]),
//     }
//   );

//   // if (response.ok) {
//     const jsonResponse = await response.json();
//     const translatedText = jsonResponse[0].translations[0].text;
//     console.log(translatedText);
// }
//Test===============================================================
async function translateSentence(sentence, targetLanguage) {
  const key = "f8a729fefc4d4f25a7285f4578b74d29"; // Replace with your actual API key
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
    return translatedText;
  } else {
    // console.error("Translation failed. HTTP status code:", response.status);
    const errorBody = await response.text();
    // console.error("Error response body:", errorBody);
    return null;
  }
}
// Example usage:
// const sentenceToTranslate = "Hello, how are you?";
// const targetLanguage = "fr"; // Replace with your target language code

// translateSentence(sentenceToTranslate, targetLanguage);
