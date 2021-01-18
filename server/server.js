const express = require('express')
const app = express()
const sanitizeHtml = require('sanitize-html');

const TurndownService = require('turndown')

const turndownService = new TurndownService({ headingStyle: 'atx' })

app.use(express.json())

app.post("/", (req, res) => {
  const { data } = req.body
  const clean = sanitizeHtml(data);
  const markdown = turndownService.turndown(clean)
  console.log(markdown)

  res.json(markdown)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))