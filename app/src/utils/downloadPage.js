import https from 'node:https'

/** @param {string} url */
export async function downloadPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = ''

      // Check if the response status code is 200
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get page, status code: ${response.statusCode}`))
        return
      }

      // Accumulate data as it comes in
      response.on('data', (chunk) => {
        data += chunk
      })

      // Resolve the promise when all data is received
      response.on('end', () => {
        resolve(data)
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}
