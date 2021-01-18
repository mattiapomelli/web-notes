// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { downloadFile } from '../utils/downloadfile'
import { MessageType } from '../types/types'

let notes = ''
let notesHTML = ''

chrome.runtime.onMessage.addListener((message: MessageType) => {
  const { type } = message

  switch(type) {
    case "notes":
      notes += message.text + "\n\n"
      notesHTML += message.html
      break

    case "download":
      fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: notesHTML})
      })
      .then(res => res.json())
      .then(data => {
        downloadFile(data, "try.txt", "text/html")
        notes = ''
        notesHTML = ''  
      })
      .catch(err => {
        console.log(err);
      })

      break
    
    case "new-session":
      chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        const activeTab = tabs[0]
        if(activeTab.id) {
          const message: MessageType = {type: "new-session"}
          chrome.tabs.sendMessage(activeTab.id, message)
        }
      })
      break
  }
})

