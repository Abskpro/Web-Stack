const express = require("express");
const webpush = require("web-push");
const nodemailer = require("nodemailer");
const { google }  = require('googleapis');
require("dotenv").config();
const user = process.env.user;
const password = process.env.password;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
/**
 * pushNotification.
 *
 * @param {} push [takes in the actual push data from server side]
 * @param {} message [types of message to be displayed to the user]
 */
const pushNotification = async (push, message) => {
  let subscription = {
    endpoint: push.pushData.endpoint,
    expirationTime: null,
    keys: {
      p256dh: push.pushData.keys.p256dh,
      auth: push.pushData.keys.auth,
    },
  };
  const payload = JSON.stringify({ title: message });
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
};

/**
 * mailNotification.
 *
 * @param {} emailId [users email id]
 * @param {} message [message to be sent to the user]
 * @param {} link [link to be sent to the user for interation]
 */
const mailNotification = async (emailId, message, link) => {

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  oAuth2Client.setCredentials({ refresh_token:REFRESH_TOKEN})
  const accessToken = await oAuth2Client.getAccessToken();

  console.log(emailId, message, link);
  let smtpTrasport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: user,
      // pass: password,
      type:'OAuth2', 
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    },
  });
  let mailOptions = {
    from: `Choose Your Space <${user}>`,
    to: `${emailId}`,
    subject: "Notification Alert",
    text:" hello",
    html: link,
  };
  smtpTrasport.sendMail(mailOptions, function (err) {
    if (err) {
      console.log(err);
      return { message: "error" };
    } else {
      console.log("message sent" + message);
      return { message: "sent" };
    }
  });
};

module.exports = { pushNotification, mailNotification };
