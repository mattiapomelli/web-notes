function getStorageValue(key: string, callback: (value: any) => void) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key])
  })
}

function setStorageValue(key: string, value: any) {
  chrome.storage.local.set({[key]: value})
}

function updateStorageValue(key: string, callback: (prevValue: any) => any) {
  chrome.storage.local.get([key], (result) => {
    const prevValue = result[key]

    const newValue = callback(prevValue)

    chrome.storage.local.set({[key]: newValue})
  })
}

export {
  getStorageValue,
  setStorageValue,
  updateStorageValue
}