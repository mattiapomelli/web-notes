// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'
import { downloadFile } from '../utils/downloadfile'

let notes = ''
let notesHTML = ''

chrome.runtime.onMessage.addListener(receivedMessage)

type Message = {
  type: string,
  text?: string,
  html?: string
}
 
function receivedMessage(message: Message) {
  const { text, type, html = "" } = message

  switch(type) {
    case "notes":
      notes += text + "\n\n"
      notesHTML = notesHTML.concat(html)
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
    
    case "new-notes":
      chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        const activeTab = tabs[0]
        if(activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'new-notes'})
        }
      })
      break
  }
}


