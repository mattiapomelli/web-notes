// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'


const notesScreen = document.getElementById("notes-container")
const downloadScreen = document.getElementById("download-container")

const notesButton = document.getElementById("notes-button")
notesButton?.addEventListener("click", startNotesSession)

const downloadButton = document.getElementById("download-button")
downloadButton?.addEventListener("click", startDownloaad)


if(window.localStorage.getItem('status') == 'active') {
  showScreen("download")
}


function startDownloaad() {
  chrome.runtime.sendMessage({ type: "download"});
}

function startNotesSession() {
  showScreen("download")
  window.localStorage.setItem("status", "active");
  chrome.runtime.sendMessage({ type: "new-notes" });
}

function showScreen(screen: "notes" | "download") {
  if(notesScreen) {
    notesScreen.style.display = screen === "notes" ? "block" : "none";
  }
  if(downloadScreen) {
    downloadScreen.style.display = screen === "download" ? "block" : "none";
  }
}