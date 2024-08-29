/**
 * Middleware to describe images without caption/description by image
 * recognition.
 *
 * @type {import('@chatally/core').Middleware}
 */
export const describeImage = async ({ req, res, media }) => {
  if (!res.isWritable) return
  if (res.messages.length > 0) return
  if (req.type !== 'image') return
  if (req.caption) return
  if (req.description) return

  try {
    const raw = await media.load(req)
    const description = await imageRecognition(raw)
    if (description) {
      req.description = description
    } else {
      res.write(`You sent me an image without any text (${raw.length}bytes, ${req.mimeType}) and I do not recognize it.
  Can you please describe it for me?`)
    }
  } catch (_e) {
    res.write(`Something went wrong, I cannot see the image you sent! Can you describe what's in it?
Image URL: ${req.url}`)
  }
}

/**
 * Just some mock image recognition
 * @param {Buffer} _buffer
 */
async function imageRecognition(_buffer) {
  return undefined
}
