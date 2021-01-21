// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

import { updateStorageValue } from '../utils/storage'
import { MessageType, NotesType } from '../types/types'


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
  }
})
