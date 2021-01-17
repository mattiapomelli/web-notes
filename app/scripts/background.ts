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
      notes += text + "\n"
      notesHTML += html.replace(/="[^"]*"/, "");
      break
    case "download":
      downloadFile(notesHTML, "try.html", "text/html")
      notes = ''
      notesHTML = ''
  }
}


