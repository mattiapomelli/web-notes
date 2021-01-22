// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { getStorageValue, setStorageValue } from '../utils/storage'
import { sendMessageToAllTabs } from '../utils/message'
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


// show notes screen if a notes session is active
getStorageValue("status", (status: string) => {
  if(status === "active") {
    showScreen("notes")
    getStorageValue("notes-title", (title: string) => {
      if(title && notesTitle) notesTitle.innerText = title
    })
  }
})

// download notes file in selected format
function startDownload() {
  const dropdown = <HTMLSelectElement> document.getElementById("format-dropdown")
  const format = <FormatType> dropdown?.options[dropdown.selectedIndex].value

  
  getStorageValue<NotesType>("notes", (value) => {
    getStorageValue("notes-title", (title: string) => {
      handleDownload(value, format, title)
    })
  })
}

// start new notes session and initialize it in storage
function startNotesSession() {
  const title = titleInput?.value
  sendMessageToAllTabs({ type: "new-session"})

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
  sendMessageToAllTabs({ type: "reset-session"})
  setStorageValue("status", "inactive")
  showScreen("setup")
}

function showScreen(screen: "setup" | "notes") {
  console.log("screen")
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

function handleDownload(notes: NotesType, format: FormatType, title: string) {

  const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.${format}`
  
  if(format === "txt") {
    downloadFile(notes.plain, filename, "text/plain")
  } else {
    console.log(process.env.API_URL)
    fetch(`${process.env.API_URL}/.netlify/functions/notes`, {
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
    .then(res => {
      console.log(res)
      return res.json()
    })
    .then(data => {
      console.log(data)
      downloadFile(data, filename, "text/html")
    })
    .catch(err => {
      console.log(err);
    })
  }
}