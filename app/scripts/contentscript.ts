// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import getHTMLOfSelection from '../utils/selection'
import { getStorageValue, updateStorageValue } from '../utils/storage'
import { MessageType, NotesType } from '../types/types'


// if notes session is active initialize event listener on load
getStorageValue("status", (status: string) => {
  if(status === "active") {
    window.addEventListener("mouseup",  mouseUpHandler, false);
  }
})

chrome.runtime.onMessage.addListener((message: MessageType) => {
  const { type } = message

  switch (type) {
    case 'new-session':
      window.addEventListener("mouseup",  mouseUpHandler, false);
      break
    case 'reset-session':
      window.removeEventListener("mouseup",  mouseUpHandler, false);
      break
  }

})

function mouseUpHandler(event: MouseEvent) {
  if(window.getSelection()) {
    const selection = window.getSelection() ?? ''
    const selectedText = selection.toString()
  
    if(selectedText.length > 0) {

      updateStorageValue<NotesType>("notes", (prev) => {
        const updatedNotes = {
          plain: prev.plain + selectedText + "\n\n",
          html: prev.html + getHTMLOfSelection()
        }
        return updatedNotes
      })

      createNotification(event.clientX + 30, event.pageY - 30)
    }
  }
}

// create a notification on the DOM telling that notes have been taken
function createNotification(x: number, y: number) {
  const notification = document.createElement("div")
  notification.innerText = "Notes taken ✔️"

  const styles = {
    color: "black",
    backgroundColor: "#eee",
    borderRadius: "10px",
    border: "1px solid #ccc",
    position: "absolute",
    padding: "5px 10px"
  }

  Object.assign(notification.style, styles)
  document.body.appendChild(notification)
  
  notification.animate([
    { opacity: '0' },
    { opacity: '1' }
  ], {
    duration: 300
  });

  notification.style.top = `${y}px`
  notification.style.left = `${x}px`;
  window.setTimeout(() => {
    notification.remove()
  }, 2000)
}