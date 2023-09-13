/**
 * Chrome Extension Checkbox Handler
 * ---------------------------------
 * This script is a content script for a Chrome extension. It listens for changes in a checkbox element
 * in the extension's popup UI and sends a message to the currently active tab to control the behavior
 * of the content script injected into that tab.
 */

/**
 * Checkbox Change Event Listener
 * --------------------------------
 * This function adds a 'change' event listener to the checkbox element defined in the popup UI.
 * When the checkbox state changes (i.e., checked or unchecked), it triggers the corresponding action.
 * If the checkbox is checked, a message with the "ON" flag is sent to the active tab to enable a feature.
 * If the checkbox is unchecked, a message with the "OFF" flag is sent to disable the feature.
 */
var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener("change", function () {
  if (this.checked) {
    // Checkbox is checked
    console.log("Checkbox is checked..");

    // Get the currently active tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      // console.log(activeTab);

      // Send a message with the "ON" flag to the content script in the active tab
      chrome.tabs.sendMessage(activeTab.id, { message: "ON" });

      // console.log("sent");
    });
  } else {
    // Checkbox is unchecked
    console.log("Checkbox is not checked..");

    // Get the currently active tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      // console.log(activeTab);

      // Send a message with the "OFF" flag to the content script in the active tab
      chrome.tabs.sendMessage(activeTab.id, { message: "OFF" });

      // console.log("sent");
    });
  }
});
