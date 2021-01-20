function getStorageValue<T>(key: string, callback: (value: T) => void) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key])
  })
}

function setStorageValue<T>(key: string, value: T) {
  chrome.storage.local.set({[key]: value})
}

function updateStorageValue<T>(key: string, callback: (prevValue: T) => T) {
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