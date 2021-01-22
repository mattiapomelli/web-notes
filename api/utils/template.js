module.exports = getHTMLfromTemplate = (content) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
        }
    
        #container {
          width: 90%;
          max-width: 700px;
          margin: 0 auto;
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
      </style>
    </head>
    <body>
      <div id="container">
        ${content}
      </div>
    </body>
    </html>`
}