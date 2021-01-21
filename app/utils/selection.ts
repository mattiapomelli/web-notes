const textTags = ["h1", "h2", "h3", "h4",  "h5", "h6", "p"]

export default function getHTMLOfSelection() {
  
  if (window.getSelection) {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const startNode = range.startContainer;
      const endNode = range.endContainer;
    
      // Special case for a range that is contained within a single node
      if (startNode == endNode) {
        console.log("one node")
        const tag = startNode.parentElement?.localName
        return `<${tag}>${selection.toString()}</${tag}>`   // put only selection instead of whole value ?
      }
      
      const clonedSelection = range.cloneContents();

      const div = document.createElement('div');    
      div.appendChild(clonedSelection);
      const selectionHTML = div.innerHTML

      const ancestor = range.commonAncestorContainer.nodeName.toLocaleLowerCase()

      if(textTags.includes(ancestor)) {
        return `<${ancestor}>${selectionHTML}</${ancestor}>`
      }

      return selectionHTML
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}
