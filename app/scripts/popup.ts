// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { getStorageValue, setStorageValue } from '../utils/storage'
import { sendMessageToActiveTab } from '../utils/message'
import { downloadFile } from '../utils/downloadfile'
import { FormatType, NotesType } from '../types/types'

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
  const format = <FormatType> dropdown?.options[dropdown.selectedIndex].value

  getStorageValue<NotesType>("notes", (value) => {
    handleDownload(value, format)
  })

  // sendMessageToBackground({ type: "download", format: value})
}

function startNotesSession() {
  const title = titleInput?.value
  // sendMessageToBackground({ type: "new-session", title })
  sendMessageToActiveTab({ type: "new-session"})


  setStorageValue("status", "active")
  setStorageValue("notes-title", title)
  setStorageValue<NotesType>("notes", {
    plain: title + "\n\n",
    html: `<h1>${title}</h1>`
  })
  
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

function handleDownload(notes: NotesType, format: FormatType = "txt") {

  if(format === "txt") {
    downloadFile(notes.plain, `try.${format}`, "text/plain")
  } else {
    fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: notes.html,
        format
      })
    })
    .then(res => res.json())
    .then(data => {
      downloadFile(data, `try.${format}`, "text/html")
    })
    .catch(err => {
      console.log(err);
    })
  }
}