const getHTMLfromTemplate = require('../utils/template')
const sanitizeHtml = require('sanitize-html');
const TurndownService = require('turndown')
const beautifyHtml = require('js-beautify').html;

const turndownService = new TurndownService({ headingStyle: 'atx' })

exports.handler = async event => {

  if(event.httpMethod === 'POST') {
    const { data, format, contentOnly = false } = JSON.parse(event.body)

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

    return {
      statusCode: 200,
      body: result,
    }

  } else {
    return {
      statusCode: 405,
      body: "Method not allowed",
    }
  }
}