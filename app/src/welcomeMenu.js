import { image } from '@chatally/utils'
import { conf } from './conf.js'

const welcome = image('media/avatar.png', `Hi!

I am ChatAlly, the unopinionated, minimalist chat framework for Node.js. I want to make hosting your own chatbot as easy as hosting an Express.js web application.`, 'Avatar of ChatAlly')

/** @type {import('@chatally/core').ChatMessage} */
const menu = {
  type: 'menu',
  content: 'What can I help you with?',
  title: 'Select',
  sections: [
    {
      actions: [
        {
          title: '🤝 Quick Intro',
          description: 'Learn a few basics about ChatAlly',
          command: '/intro',
        },
        {
          title: '🚀 Getting Started',
          description: 'TLDR; Dive right into your first chatbot',
          command: '/getting-started',
        },
        {
          title: '📗 Documentation',
          description: 'Find the complete reference documentation of ChatAlly',
          command: '/documentation',
        },
        {
          title: '📢 Recommend',
          description: 'How to tell your friends about ChatAlly',
          command: '/recommend',
        },
      ],
    },
  ],
}

/** @type {import('@chatally/core').ChatMessage} */
const intro = {
  type: 'text',
  content: `ChatAlly is an application framework for self-hosted chatbots, similar to Express.js for web applications.

Self-hosting might be important to you, if you **care about data protection**, want to make sure, your **hosting costs do not go crazy** or you want the flexibility to **create a unique chat experience** for your users.

The architecture and all it's interfaces are very open, so that it is easy to integrate your chatbot with WhatsApp, Signal and AI or whatever modules you have in mind.

If you want to get a bit more of an overview, visit my website at

https://chatally.org`,
}

/** @type {import('@chatally/core').ChatMessage} */
const gettingStarted = {
  type: 'text',
  content: `Getting started is really easy. If you are a web developer, I assume you have node.js and npm installed, then just do

__npm install @chatally/core @chatally/console__

and start creating your application. To continue, have a look at

https://chatally.org/guides`,
}

/** @type {import('@chatally/core').ChatMessage} */
const documentation = {
  type: 'text',
  content: `Documentation is an important part of ChatAlly, so we spend quite some effort to create comprehensive documentation and keep it up to date.

Find the reference documentation at
https://chatally.org/reference

Create a Github issue, if you find something missing
https://github.com/chatally/chatally/issues

Get support or discuss upcoming features with the community in Discord
https://discord.gg/Sb8ECsQCgr`,
}

/** @type {import('@chatally/core').ChatMessage} */
const recommend = {
  type: 'text',
  content: `I am very happy, that you want to recommend ChatAlly, just tell them to send 'Hi!' to ${conf.phoneNumber} or use the following links.

Tell your friends to checkout this demo on WhatsApp
${whatsappMessage(`Look what I found at the Prototype Fund Demo-Day: ChatAlly is a framework for self-hosted chatbots. Send ${whatsappMessage('Hi!', conf.phoneNumber)}`)}

Tell them to have a look at our website
${whatsappMessage(`Look what I found at the Prototype Fund Demo-Day: ChatAlly is a framework for self-hosted chatbots. Have a look at their website: https://chatally.org`)}`,
}

/**
 * @param {string} text
 * @param {string} [number]
 */
function whatsappMessage(text, number) {
  return `https://wa.me/${number || ''}?text=${encodeURIComponent(text)}`
}

/**
 * Middleware to show a welcome message and a menu with some options.
 *
 * @type {import('@chatally/core').Middleware}
 */
export const welcomeMenu = async ({ req, res }) => {
  const command = req.type === 'action' ? req.command : req.type === 'text' ? req.content : undefined

  if (command === '/welcome') {
    res.write(welcome)
    res.write(menu)
  } else if (command === '/intro') {
    res.write(intro)
  } else if (command === '/getting-started') {
    res.write(gettingStarted)
  } else if (command === '/documentation') {
    res.write(documentation)
  } else if (command === '/recommend') {
    res.write(recommend)
  }
}
