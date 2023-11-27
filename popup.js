// document.getElementById("French").addEventListener("click", () => {
//   console.log("French button clicked");
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { action: "translate" });
//   });
// });

// document.getElementById("English").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { action: "translate" });
//   });
// });

// document.getElementById('translateButton').addEventListener('click', function () {
//   // Send a message to the content script to execute the code on the webpage
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { message: "button_clicked" });
//   });
// });

document.getElementById('French').addEventListener('click', function() {
  console.log("French button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("sending French translate signal");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'translate' });
  });
});

document.getElementById('English').addEventListener('click', function() {
  console.log("English button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("sending English translate signal");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'English_Translate' });
  });
});

document.getElementById('Spanish').addEventListener('click', function() {
  console.log("Spanish button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("sending Spanish translate signal");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'Spanish_Translate' });
  });
});

