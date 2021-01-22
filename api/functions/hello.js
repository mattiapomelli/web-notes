const sanitizeHtml = require('sanitize-html');

exports.handler = async event => {
  const subject = event.queryStringParameters.name || 'World'
  const html = '<h1 class="something">Hey!!</h1>'

  const cleanHTML = sanitizeHtml(html);

  return {
    statusCode: 200,
    body: cleanHTML,
  }
}