// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { MessageType, FormatType } from '../types/types'

const notesScreen = document.getElementById("notes-container")
const downloadScreen = document.getElementById("download-container")

const notesButton = document.getElementById("notes-button")
notesButton?.addEventListener("click", startNotesSession)

const downloadButton = document.getElementById("download-button")
downloadButton?.addEventListener("click", startDownloaad)


chrome.storage.local.get(["status"], (result) => {
  console.log(result)
  if(result.status === "active") {
    console.log("here")
    showScreen("download")
  }
})


function startDownloaad() {
  const dropdown = <HTMLSelectElement> document.getElementById("format-dropdown")
  const value = <FormatType> dropdown?.options[dropdown.selectedIndex].value

  const message: MessageType = { type: "download", format: value}
  chrome.runtime.sendMessage(message);
  chrome.storage.local.set({"status": "inactive"})
  showScreen("notes")
}

function startNotesSession() {
  const message: MessageType = { type: "new-session" }
  chrome.runtime.sendMessage(message);
  chrome.storage.local.set({"status": "active"})
  showScreen("download")
}

function showScreen(screen: "notes" | "download") {
  if(notesScreen) {
    notesScreen.style.display = screen === "notes" ? "block" : "none";
  }
  if(downloadScreen) {
    downloadScreen.style.display = screen === "download" ? "block" : "none";
  }
}