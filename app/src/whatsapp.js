import { GraphApi, GraphApiMock, WhatsAppCloud } from '@chatally/whatsapp-cloud'
import { DBLogger } from './DBLogger.js'

/** @type {undefined | GraphApi} */
let graphApi
/** @type {undefined | Omit<import('@chatally/whatsapp-cloud').MessagesConfig, "graphApi">} */
let messages

if (!process.env.WHATSAPP_CLOUD_GRAPHAPI_ACCESS_TOKEN) {
  // only for local debugging
  graphApi = new GraphApiMock({ phoneNumberId: '1234', accessToken: 'ABCD' })
  messages = { sequential: false }
} else {
  messages = { sequential: 15 }
}

/**
 * Firstly, we setup a WhatsApp Cloud Server, where all configuration is read
 * from a .env file:
 *
 * - WHATSAPP_CLOUD_GRAPHAPI_PHONE_NUMBER_ID
 * - WHATSAPP_CLOUD_GRAPHAPI_ACCESS_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_VERIFY_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_SECRET
 *
 * You have to set these values up in your WhatsApp Cloud application dashboard.
 * The following page in "Meta for Developers" explains how to do that in
 * general. This explanation includes an endpoint that you should implement.
 * You do not have to implement that endpoint, that is what ChatAlly's WhatsApp
 * Cloud Server does for you.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks-product.
 *
 * Find a detailed explanation, how we deploy our example in a Docker container
 * behind a Traefik proxy from a Github action here:
 *
 * https://chatally.org/examples/whatsapp-cloud
 *
 * Just deploy it to some publicly available URL (potentially including a path,
 * in case you are running multiple ChatAlly servers on the same domain).
 */
export const whatsapp = new WhatsAppCloud({
  log: new DBLogger({
    level: 'debug',
    name: 'WhatsApp',
    path: 'data/messages.db',
  }),
  webhooks: { path: '/whatsappcloud' },
  media: { dbPath: 'data/wa-media-ids.db' },
  graphApi,
  messages,
})
