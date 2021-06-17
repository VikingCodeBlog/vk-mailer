const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const amqp = require('amqplib/callback_api');

if (!process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

async function sendEmail(msg) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });

  await transporter.sendMail(JSON.parse(msg.content));
}

amqp.connect(process.env.AMQP_URL, (error0, connection) => {
  if (error0)
    throw error0;

  connection.createChannel((error1, channel) => {
    if (error1)
      throw error1;

    const queue = process.env.AMQP_QUEUE;

    channel.assertQueue(queue, { durable: false });
    channel.consume(queue, (msg) => sendEmail(msg), { noAck: true });
  });
});
