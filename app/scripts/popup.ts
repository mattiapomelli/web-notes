// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { getStorageValue, setStorageValue } from '../utils/storage'
import { sendMessageToActiveTab, sendMessageToBackground } from '../utils/message'
import { FormatType } from '../types/types'

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

  sendMessageToBackground({ type: "download", format: value})
}

function startNotesSession() {
  const title = titleInput?.value
  sendMessageToBackground({ type: "new-session", title })

  setStorageValue("status", "active")
  setStorageValue("notes-title", title)
  
  showScreen("notes")

  if(notesTitle) {
    notesTitle.innerText = title
  }
}

function resetNotesSession() {
  sendMessageToActiveTab({ type: "reset-session"})
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