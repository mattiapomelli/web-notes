// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { downloadFile } from '../utils/downloadfile'
import { setStorageValue, getStorageValue, updateStorageValue } from '../utils/storage'
import { MessageType, FormatType, NotesType } from '../types/types'


chrome.runtime.onMessage.addListener((message: MessageType) => {
  const { type } = message

  switch(type) {
    case "notes":
      updateStorageValue<NotesType>("notes", (prev) => {
        const updatedNotes = {
          plain: prev.plain + message.text + "\n\n",
          html: prev.html + message.html
        }
        return updatedNotes
      })
      break

    case "download":
      getStorageValue<NotesType>("notes", (value) => {
        handleDownload(value, message.format)
      })
      break
    
    case "new-session":
      chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        const activeTab = tabs[0]
        if(activeTab && activeTab.id) {
          const newMessage: MessageType = {type: "new-session"}
          chrome.tabs.sendMessage(activeTab.id, newMessage)

          setStorageValue<NotesType>("notes", {
            plain: message.title + "\n\n",
            html: `<h1>${message.title}</h1>`
          })
        }
      })
      break
  }
})

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