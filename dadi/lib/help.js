const path = require('path')
const cache = require(path.join(__dirname, '/cache'))

module.exports.clearCache = function (pathname, callback) {
  cache().delete(pathname, (err) => {
    if (err) console.log(err)
    return callback(null)
  })
}

// helper that sends json response
module.exports.sendBackJSON = function (successCode, results, res) {
  res.statusCode = successCode

  let resBody

  if (results instanceof Error) {
    res.statusCode = results.statusCode || successCode || 500

    resBody = JSON.stringify({
      message: results.message || 'unknown error',
      statusCode: res.statusCode,
      success: false
    })
  } else {
    resBody = JSON.stringify(results)
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Length', Buffer.byteLength(resBody))
  res.end(resBody)
}

/**
 * Display Unauthorized Error
 */
module.exports.displayUnauthorizedError = function (res) {
  res.statusCode = 401
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Expires', '-1')

  let errorMsg = {
    Error: 'HTTP 401 Unauthorized'
  }

  res.end(JSON.stringify(errorMsg))
}
