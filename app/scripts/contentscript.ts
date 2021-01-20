// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import getHTMLOfSelection from '../utils/selection'
import { getStorageValue } from '../utils/storage'
import { MessageType } from '../types/types'


// if notes session is active initialize event listener on load
getStorageValue("status", (status: string) => {
  if(status === "active") {
    window.addEventListener("mouseup",  mouseUpHandler, false);
  }
})

chrome.runtime.onMessage.addListener((message: MessageType) => {
  console.log(message)
  const { type } = message

  switch (type) {
    case 'new-session':
      window.addEventListener("mouseup",  mouseUpHandler, false);
      break
  }

})

function mouseUpHandler() {
  if(window.getSelection()) {
    const selection = window.getSelection() ?? ''
    const selectedText = selection.toString()
  
    if(selectedText.length > 0) {
      console.log(`%c Text selected: ${selectedText}`, "color: blue")
      console.log(getHTMLOfSelection())
  
      const message = {
        type: "notes",
        text: selectedText,
        html: getHTMLOfSelection()
      }
  
      chrome.runtime.sendMessage(message)
    }
  }
}
