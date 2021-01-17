// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

const button = document.getElementById("download-button")
button?.addEventListener("click", sendMessage)

function sendMessage() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    const message = {
      type: "download"
    }
    chrome.runtime.sendMessage(message);
  });
}
