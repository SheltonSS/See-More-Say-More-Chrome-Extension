console.log("background");

// chrome.action.onClicked.addListener(function (tab) {
//   // Handle the click event, for example, by sending a message to the content script
//   if (request.action === "translate") {
//     chrome.tabs.sendMessage(tab.id, { action: "translate" });
//   } else if(request.action === "English_Translate"){
//     chrome.tabs.sendMessage(tab.id, { action: "English_Translate" });
//   }else if(request.action === "Spanish_Translate"){
//     chrome.tabs.sendMessage(tab.id, { action: "Spanish_Translate" });
//   }
// });

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
  //back to base
  if (info.menuItemId === "Back_t_Base") {
    const selectedText = info.selectionText;
    if (selectedText) {

      // Send a message to content script to handle translation
      chrome.tabs.sendMessage(tab.id, {
        action: "translateBTB",
        selectedText: selectedText,
      });

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

// //define contextMenuItem
// var contextMenuItem = {
//   "id": "myContextMenu",
//   "title": "My Context Menu",
//   "contexts": ["selection"]
// };

// chrome.runtime.onInstalled.addListener(() => {
//   // Create a context menu item
//   chrome.contextMenus.create({
//     id: "myContextMenu",
//     title: "My Context Menu",
//     contexts: ["selection"]
//   });
// });

// // Add a listener for the context menu item click
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "myContextMenu") {
//     // Send a message to the content script
//     chrome.tabs.sendMessage(tab.id, { action: "contextMenuItemClicked" });
//   }
// });