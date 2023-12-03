console.log("background");
// const apiKey = process.env.MY_API_KEY; // Replace with your actual environment variable

chrome.runtime.onInstalled.addListener(function () {
  // Create context menu item
  chrome.contextMenus.create({
    id: "Store_For_Later_Study",
    title: "Store For Later Study",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "Back_t_Base",
    title: "Back to English",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "In_a_Sentence",
    title: "Example In A Sentence",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  // Back to base
  if (info.menuItemId === "Back_t_Base") {
    const selectedText = info.selectionText;
    if (selectedText) {
      const selectedText = info.selectionText;
      // Send a message to the content script to handle translation
      chrome.tabs.sendMessage(tab.id, {
        action: "translateBTB",
        selectedText: selectedText,
      });

      // makeTextToSpeechRequest(selectedText);
    }
  } else if (info.menuItemId === "Store_For_Later_Study") {
    const selectedText = info.selectionText;
    if (selectedText) {
      // Send a message to content script to handle translation
      chrome.tabs.sendMessage(tab.id, {
        action: "Store",
        selectedText: selectedText,
      });
    }
  } else if (info.menuItemId === "In_a_Sentence") {
    const selectedText = info.selectionText;
    if (selectedText) {
      // Send a message to content script to handle translation
      chrome.tabs.sendMessage(tab.id, {
        action: "SentenceSelectedText",
        selectedText: selectedText,
      });
    }
  }
});
//text to speach ================================================
// background.js

// Example function to make the Text to Speech API request // doesnt work
async function makeTextToSpeechRequest(text) {
  console.log("Make TTS Request");
  const apiKey = "";
  const apiUrl =
    "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken"; // Example endpoint for obtaining a token

  // Make the API request to obtain the token
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
    },
  });

  const token = await response.text();

  // Now you have the token, use it to make the actual Text to Speech API request
  const speechApiUrl =
    "https://vision-language-search-speach.cognitiveservices.azure.com/"; // Replace with your Text to Speech API endpoint
  const speechResponse = await fetch(speechApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/ssml+xml",
    },
    body: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
            <voice name='en-US-GuyNeural'>
              <s>${text}</s>
            </voice>
          </speak>`,
  });
  // Play the synthesized speech
  const audioBlob = await speechResponse.blob();
  // const audioUrl = URL.createObjectURL(audioBlob);
  // const audio = new Audio(audioUrl);
  // audio.play();
  // Convert the blob to a data URL
  // const audioArrayBuffer = await speechResponse.arrayBuffer();
  // const audioDataUrl =
  //   "data:audio/wav;base64," +
  //   btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)));

  // Play the synthesized speech
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "playAudio", audioBlob });
  });

  console.log("API request successful");
  return "API request successful"; // Example response
}
