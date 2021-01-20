export default function getHTMLOfSelection() {
  
  if (window.getSelection) {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      let node = range.startContainer;
      const endNode = range.endContainer;
    
      // Special case for a range that is contained within a single node
      if (node == endNode) {
        const tag = node.parentElement?.localName
        return `<${tag}>${node.nodeValue}</${tag}>`
      }

      const clonedSelection = range.cloneContents();
      const div = document.createElement('div');
      
      div.appendChild(clonedSelection);

      return div.innerHTML
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}
