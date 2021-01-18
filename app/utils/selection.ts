
function getNodesFromSelection() {
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    let node = range.startContainer;
    const endNode = range.endContainer;
  
    // Special case for a range that is contained within a single node
    if (node == endNode) {
      return [node];
    }

    const clonedSelection = range.cloneContents();
    // const selectedNodes = Array.from(clonedSelection.childNodes)
    // return selectedNodes
    return clonedSelection.childNodes
  } 

  return []
}

function getHTMLOfSelection() {
  
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
      
      // for(let i = 0; i < clonedSelection.childNodes.length; i++) {
      //   let child = <Element>clonedSelection.childNodes[i];       
      //   if(!(child.nodeName === "#text")) {
      //     for(let j = 0; j < child.attributes.length; j++) {
      //       let attr = child.attributes[j].name
      //       child.removeAttribute(attr);
      //     }
      //   }
      // }
      
      div.appendChild(clonedSelection);
      // const selectedNodes = Array.from(clonedSelection.childNodes)
      // const clean = sanitizeHtml(div.innerHTML);

      return div.innerHTML + "/n";
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}

function nextNode(node: Node | null){
  if (node && node.hasChildNodes()) {
    return node.firstChild;
  } else {
    while (node && !node.nextSibling) {
      node = node.parentNode;
    }
    if (!node) {
      return null;
    }
    return node.nextSibling;
  }
}

function getRangeSelectedNodes(range: any) {
  let node = range.startContainer;
  const endNode = range.endContainer;

  // Special case for a range that is contained within a single node
  if (node == endNode) {
      return [node];
  }

  // Iterate nodes until we hit the end container
  const rangeNodes = [];
  while (node && node != endNode) {
      rangeNodes.push( node = nextNode(node) );
  }

  // Add partially selected nodes at the start of the range
  node = range.startContainer;
  while (node && node != range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node.parentNode;
  }

  return rangeNodes;
}

function getSelectedNodes() {
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed) {
    return getRangeSelectedNodes(sel.getRangeAt(0));
  }
  return [];
}

export {
  getHTMLOfSelection,
  getSelectedNodes,
  getNodesFromSelection
}