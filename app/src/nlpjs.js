import fs from 'node:fs/promises'
import { noLogger } from '@chatally/logger'
import { nlpjsMiddleware, trainNlp } from '@chatally/nlpjs'
import { scrapeWebsite } from './utils/scrapeWebsite.js'

const DAY = 24 * 60 * 60 * 1000

const websiteCorpus = './nlpjs/website.json'
const stat = await fs.stat(websiteCorpus)
if (!stat || stat.mtime.getTime() + 1 * DAY < Date.now()) {
  const corpus = await scrapeWebsite('https://chatally.org')
  await fs.writeFile(websiteCorpus, JSON.stringify(corpus, null, 2))
}

const nlp = await trainNlp(noLogger, {
  settings: {
    nlp: {
      corpora: [
        './nlpjs/general-questions.json',
        websiteCorpus,
        './nlpjs/chitchat.json',
      ],
    },
  },
  use: ['Basic'],
})

export const nlpjs = nlpjsMiddleware(nlp, {
  threshold: 0.5,
  onlyEmptyResponse: true,
})
