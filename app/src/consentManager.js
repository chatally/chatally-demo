import { ConsentManager } from '@chatally/consent-manager'

export const consentManager = new ConsentManager({
  askForConsent: {
    type: 'buttons',
    content: '✅ Hi, I am ChatAlly and I am a chat bot.\n\nThat means, that the data that you provide will be processed automatically, parts of it will also be stored. Only the minimum data required to provide our services will be stored and nothing will be shared with third parties. But other parties could be involved in the message transportation, depending on the client you are using.\n\nIf you do not accept, I will not be able to talk to you.\n\n See https://chatally.org/impressum for more details.',
    actions: [
      {
        command: 'accept',
        title: '👍  I accept',
      },
      {
        command: 'reject',
        title: '👎  I DO NOT accept',
        description: 'You could also directly leave this chat and forget about it, as you will be doomed in an endless loop of me asking you, if you consent to our terms.',
      },
    ],
  },
  nextCommand: '/welcome',
})
