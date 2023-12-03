document.addEventListener("DOMContentLoaded", function () {
  // Add event listener for the "French" button
  document.getElementById("French").addEventListener("click", function () {
    console.log("French button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("sending French translate signal");
      chrome.tabs.sendMessage(tabs[0].id, { action: "translate" });
    });
  });

  // Add event listener for the "English" button
  document.getElementById("English").addEventListener("click", function () {
    console.log("English button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("sending English translate signal");
      chrome.tabs.sendMessage(tabs[0].id, { action: "English_Translate" });
    });
  });

  // Add event listener for the "Clear" button
  document.getElementById("Clear").addEventListener("click", function () {
    console.log("Clear button clicked");

    // Clear local storage data
    chrome.storage.local.clear(function () {
      console.log("Local storage data cleared");

      // Update the display to show that data is cleared
      const displayDataElement = document.getElementById("displayData");
      displayDataElement.innerHTML = "<p>No data available.</p>";
    });
  });

  // Add event listener for the "View" button
  document.getElementById("View").addEventListener("click", function () {
    console.log("View button clicked");

    // Fetch data from local storage
    chrome.storage.local.get(null, function (data) {
      const displayDataElement = document.getElementById("displayData");

      // Process the data and update the popup content
      if (Object.keys(data).length === 0) {
        displayDataElement.innerHTML = "<p>No data available.</p>";
      } else {
        // Clear existing content
        displayDataElement.innerHTML = "";

        // Create an unordered list
        const dataList = document.createElement("ul");
        dataList.classList.add("data-list");

        // Create list items for each key-value pair in the data
        for (const [key, value] of Object.entries(data)) {
          const listItem = document.createElement("li");
          listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
          dataList.appendChild(listItem);
        }

        // Append the unordered list to the displayData element
        displayDataElement.appendChild(dataList);
      }
    });
  });
});
