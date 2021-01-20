const express = require('express')
const app = express()
const sanitizeHtml = require('sanitize-html');
const getHTMLfromTemplate = require('./utils/template')
const TurndownService = require('turndown')
const beautifyHtml = require('js-beautify').html;

const turndownService = new TurndownService({ headingStyle: 'atx' })

app.use(express.json())

app.post("/", (req, res) => {
  const { data, format, contentOnly = false } = req.body
  const cleanHTML = sanitizeHtml(data);

  let result;

  if(format === 'md') {
    result = turndownService.turndown(cleanHTML)
  } else {
    if(contentOnly) {
      result = beautifyHtml(cleanHTML)
    } else {
      result = beautifyHtml(getHTMLfromTemplate(cleanHTML))
    }
  }

  res.json(result)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))