import * as cheerio from 'cheerio'
import { downloadPage } from './downloadPage.js'

/**
 * @typedef Data nlp.js corpus entry
 * @property {string} intent The intent id
 * @property {string[]} utterances Recognized input
 * @property {string[]} answers Possible answers
 */

/** @param {string} url */
export async function scrapeWebsite(url) {
  const [protocol, _skip, domain] = url.split('/')
  const baseUrl = `${protocol}//${domain}`
  const corpus = {
    name: 'Website',
    locale: 'en-US',
    /** @type {Data[]} */
    data: [],
  }
  /** @type {string[]} */
  const visited = []

  /** @param {string} url */
  async function scrape(url) {
    url = url.split('#')[0]
    if (!url.endsWith('/')) {
      url = `${url}/`
    }
    if (visited.includes(url)) {
      return
    }
    visited.push(url)

    try {
      const html = await downloadPage(url)
      const dom = cheerio.load(html)
      /** @type {Data|undefined} */
      let data
      dom('h1, h2, h3, h4, h5, h6, p, code').each(function () {
        const id = dom(this).attr()?.id
        if (id) {
          data = newData(url, id)
          corpus.data.push(data)
        }
        if (!data) {
          data = newData(url)
          corpus.data.push(data)
        }
        const text = dom(this).prop('innerText')
        if (text) {
          const sentences = text.trim().replaceAll(/\s/g, ' ').replaceAll('’', '\'').split('. ')
          data.utterances.push(...sentences)
        }
        // for (const utterance of text?.split(/[.;]/) || []) {
        //   data.utterances.push(utterance)
        // }
      })
      const hrefs = dom('a').map(function () {
        return dom(this).attr()?.href
      }).toArray()
      for (const href of hrefs) {
        if (href) {
          if (href.startsWith(baseUrl)) {
            await scrape(href)
          } else if (href.startsWith('/')) {
            await scrape(`${baseUrl}${href}`)
          }
        }
      }
    } catch (_e) {
      console.error('Downloading failed for', url)
    }
  }

  await scrape(url)
  return corpus
}

let counter = 1

/**
 * @param {string} url
 * @param {string} [id]
 */
function newData(url, id) {
  const href = id ? `${url}#${id}` : url
  return {
    intent: `section.${counter++}`,
    // intent: `section.${href}`,
    utterances: [],
    answers: [
      `I am not sure, but you might find this part of the website interesting:\n\n${href}`,
    ],
  }
}
