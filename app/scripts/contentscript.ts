// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'
import { getHTMLOfSelection, getSelectedNodes, getNodesFromSelection } from '../utils/selection'

window.addEventListener("mouseup",  mouseUpHandler, false);

function mouseUpHandler() {
  if(window.getSelection()) {
    const selection = window.getSelection() ?? ''
    const selectedText = selection.toString()
    // const tagName = window.getSelection().baseNode.parentElement.tagName
  
    if(selectedText.length > 0) {
      console.log(`%c Text selected: ${selectedText}`, "color: blue")
      console.log(getHTMLOfSelection())
      console.log(getNodesFromSelection())
      console.log(getSelectedNodes())
  
      const message = {
        type: "notes",
        text: selectedText,
        html: getHTMLOfSelection()
      }
  
      chrome.runtime.sendMessage(message)
    }
  }
}
