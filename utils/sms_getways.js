// require('dotenv').config();

const accountSid = "AC2e8b386372852579146d5523b3e64f71"; //process.env.TWILIO_ACCOUNT_SID;
const authToken = "e718b7d02dc643850df200ff65ac2e4e"; //process.env.TWILIO_AUTH_TOKEN;

async function sendSms(phone, message) {
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: "+19163850145",
      to: `+91${phone}`,
    })
    .then((message) => console.log(message.sid));
}

module.exports = sendSms;
