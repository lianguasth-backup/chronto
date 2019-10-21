import { WebClient } from "@slack/web-api";

const SLACK_TOKEN = process.env.SLACK_TOKEN

export const sendSlackNotification = async (message: string, channelId: string) => {

    const token = SLACK_TOKEN;
    console.log(token)
  
    const web = new WebClient(token);
  
    (async () => {
      // See: https://api.slack.com/methods/chat.postMessage
      const res = await web.chat.postMessage({ channel: channelId, text: message });
      console.log("Message sent: ", res.ts);
    })();
  
  };