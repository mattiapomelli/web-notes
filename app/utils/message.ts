import { MessageType } from '../types/types'

function sendMessageToActiveTab(message: MessageType) {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    const activeTab = tabs[0]
    if(activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, message)
    }
  })
}

function sendMessageToBackground(message: MessageType) {
  chrome.runtime.sendMessage(message);
}

export {
  sendMessageToActiveTab,
  sendMessageToBackground
}
