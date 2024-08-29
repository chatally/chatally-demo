import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'
import { audio, content, image } from '@chatally/utils'
import 'dotenv/config'
import { consentManager } from './consentManager.js'
import { describeImage } from './describeImage.js'
import { nlpjs } from './nlpjs.js'
import { welcomeMenu } from './welcomeMenu.js'
import { whatsapp } from './whatsapp.js'

new Application({
  log: { name: 'App', level: 'trace' },
  media: { ttl: 30, ttl2: 240 },
  data: { content: '' },
}) //
  // .use(new ConsoleServer('PTF'))
  .use(whatsapp)
  .use(consentManager)
  .use(welcomeMenu)
  .use(nlpjs)
  // let AI describe images without description
  .use(describeImage)
  // evaluate the request content once and for all
  .use(function toText({ req, data }) {
    data.content = content(req)
  })
  // answer unanswered cat requests
  .use(function cats({ data, res }) {
    if (res.messages.length > 0) return
    if (data.content.match(/\bcats?\b/)) {
      res.write(image(
        'media/cat.jpg',
        'I love cats. How do you like this one, isn\'t it cute?',
      ))
    }
  })
  // answer unanswered requests about the bot's voice
  .use(function voice({ data, res }) {
    if (res.messages.length > 0) return
    if (data.content.match(/\bvoice\b/)) {
      res.write(audio('media/voice.mp3', 'Do you like my voice?'))
    }
  })
  // ask to rephrase all unanswered requests
  .use(function rephrase({ data, res }) {
    if (res.messages.length > 0) return
    res.end(`You said __'${data.content}'__ and **I don't know** what it means, could you rephrase it?`)
  })
  // start the server
  .listen()
