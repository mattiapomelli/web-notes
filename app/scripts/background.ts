// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

let notes = ''

chrome.runtime.onMessage.addListener(receivedMessage)

type Message = {
  type: string,
  text?: string,
}
 
function receivedMessage(message: Message) {
  const { text, type } = message

  switch(type) {
    case "notes":
      notes += text + "\n"
      break
    case "download":
      downloadFile(notes, "try", "text/plain")
  }
}

function downloadFile(data: string, filename: string, type: string) {
  const file = new Blob([data], {type: type})

  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    const a = document.createElement("a")
    const url = URL.createObjectURL(file)
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0); 
  }
}
