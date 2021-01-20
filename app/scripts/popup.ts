// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { getStorageValue, setStorageValue } from '../utils/storage'
import { MessageType, FormatType } from '../types/types'

// get reference to dom elements
const setupScreen = document.getElementById("setup-screen")   // screen to show while not taking notes
const notesScreen = document.getElementById("notes-screen")       // screen to show while taking notes

const notesButton = document.getElementById("notes-button")
notesButton?.addEventListener("click", startNotesSession)

const downloadButton = document.getElementById("download-button")
downloadButton?.addEventListener("click", startDownload)

const previewButton = document.getElementById("preview-button")
previewButton?.addEventListener("click", openPreview)

const resetButton = document.getElementById("reset-button")
resetButton?.addEventListener("click", resetNotesSession)

const notesTitle = document.getElementById("notes-title")

const titleInput = <HTMLInputElement> document.getElementById("notes-title-input")

getStorageValue("status", (status: string) => {
  if(status === "active") {
    showScreen("notes")
    getStorageValue("notes-title", (title: string) => {
      if(title && notesTitle) notesTitle.innerText = title
    })
  }
})

function startDownload() {
  const dropdown = <HTMLSelectElement> document.getElementById("format-dropdown")
  const value = <FormatType> dropdown?.options[dropdown.selectedIndex].value

  const message: MessageType = { type: "download", format: value}
  chrome.runtime.sendMessage(message);
}

function startNotesSession() {
  const title = titleInput?.value
  const message: MessageType = { type: "new-session", title }
  chrome.runtime.sendMessage(message);

  setStorageValue("status", "active")
  setStorageValue("notes-title", title)
  
  showScreen("notes")
  console.log(notesTitle)
  if(notesTitle) {
    notesTitle.innerText = title
  }
}

function resetNotesSession() {
  setStorageValue("status", "inactive")
  showScreen("setup")
}

function showScreen(screen: "setup" | "notes") {
  if(setupScreen) {
    setupScreen.style.display = screen === "setup" ? "block" : "none";
  }
  if(notesScreen) {
    notesScreen.style.display = screen === "notes" ? "block" : "none";
  }
}

function openPreview() {
  chrome.tabs.create({ url: chrome.runtime.getURL("pages/preview.html") });
}