import { getStorageValue } from '../utils/storage'
import { NotesType } from '../types/types'

const preview = document.getElementById("preview");

getStorageValue<NotesType>("notes", (value) => {
    fetch(`${process.env.API_URL}/.netlify/functions/notes`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: value.html,
        format: "html",
        contentOnly: true
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("data: ", data);
      if(preview) {
        preview.innerHTML = data
      }
    })
    .catch(err => {
      console.log(err);
    })
  })
