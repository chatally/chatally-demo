import 'dotenv/config'
import { whatsapp } from './whatsapp.js'

whatsapp.listen();

const result = await whatsapp.send('4917623975929', {
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
})

console.log(result)