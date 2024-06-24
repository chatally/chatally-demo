import { Application } from "@chatally/core";
import { WhatsAppCloud } from "@chatally/whatsapp-cloud";

/**
 * This will read the following variables from the environment
 *
 * - WHATSAPP_CLOUD_GRAPHAPI_PHONE_NUMBER_ID
 * - WHATSAPP_CLOUD_GRAPHAPI_ACCESS_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_VERIFY_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_SECRET
 *
 * You have to set them up in your WhatsApp Cloud application dashboard.
 * The following page in "Meta for Developers" explains how to do that:
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks-product
 * You do not have to implement the endpoint, that is what the ChatAlly
 * WhatsApp Cloud server does for you. Just deploy it to some publicly
 * available URL (potentially including a port number, in case you are running
 * multiple ChatAlly servers on the same URL).
 */
const whatsapp = new WhatsAppCloud();

new Application() //
  .use(whatsapp)
  .use(function echo({ req, res }) {
    if (res.isWritable) {
      res.write(`You said '${req.text}' and I don't know what it means.`);
    }
  })
  .listen();
