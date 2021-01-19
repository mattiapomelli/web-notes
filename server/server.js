const express = require('express')
const app = express()
const sanitizeHtml = require('sanitize-html');
const getHTMLfromTemplate = require('./utils/template')
const TurndownService = require('turndown')
const beautify_html = require('js-beautify').html;

const turndownService = new TurndownService({ headingStyle: 'atx' })

app.use(express.json())

app.post("/", (req, res) => {
  const { data, format } = req.body
  const cleanHTML = sanitizeHtml(data);

  const result = format === 'md' ? turndownService.turndown(cleanHTML) : beautify_html(getHTMLfromTemplate(cleanHTML))

  res.json(result)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))