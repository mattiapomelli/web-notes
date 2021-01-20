// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { getStorageValue, setStorageValue } from '../utils/storage'
import { MessageType, FormatType } from '../types/types'

const notesScreen = document.getElementById("notes-container")
const downloadScreen = document.getElementById("download-container")

const notesButton = document.getElementById("notes-button")
notesButton?.addEventListener("click", startNotesSession)

const downloadButton = document.getElementById("download-button")
downloadButton?.addEventListener("click", startDownload)

const previewButton = document.getElementById("preview-button")
previewButton?.addEventListener("click", openPreview)

const titleInput = <HTMLInputElement> document.getElementById("notes-title")

getStorageValue("status", (status: string) => {
  if(status === "active") {
    showScreen("download")
  }
})

function startDownload() {
  const dropdown = <HTMLSelectElement> document.getElementById("format-dropdown")
  const value = <FormatType> dropdown?.options[dropdown.selectedIndex].value

  const message: MessageType = { type: "download", format: value}
  chrome.runtime.sendMessage(message);
  setStorageValue("status", "inactive")
  showScreen("notes")
}

function startNotesSession() {
  const message: MessageType = { type: "new-session", title: titleInput?.value}
  chrome.runtime.sendMessage(message);
  setStorageValue("status", "active")
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

function openPreview() {
  chrome.tabs.create({ url: chrome.runtime.getURL("pages/preview.html") });
}