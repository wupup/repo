import { createTransport, getTestMessageUrl } from 'nodemailer';
import logger from './logger.js';

// Create a transporter using SMTP
const transporter = createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

/**
 * Send an email
 * @param {string} mailAddress
 * @param {string} subject title
 * @param {string} html content html string
 * @example sendMailTo('123@163.com', 'Test Subject', '<b>Hello</b>')
 */
async function sendMail(mailAddress, subject, html) {
  try {
    await transporter.verify();
    logger.debug('Server is ready to take our messages');

    const info = await transporter.sendMail({
      from: process.env.MAILER_USER, // sender address
      to: mailAddress, // list of recipients
      subject, // subject line
      html,
      // text: 'Hello world!', // plain text body
    });

    logger.debug('Message sent: ' + info.messageId);
    // Preview URL is only available when using an Ethereal test account
    logger.debug('Preview URL: ' + getTestMessageUrl(info));
  } catch (err) {
    logger.error('[function:sendMail] 邮件发送失败', err);
  }
}

function getCodeMailData(mailAddress, code) {
  const subject = 'Wind验证码';
  const html = `
    <p>您的验证码是: <b style="font-size:20px;color:#f40;">${code}</b></p>
    <p>请妥善保管，不要泄露给他人。</p>
  `;
  return {
    to: mailAddress,
    subject,
    html,
  };
}

async function sendCodeMail(mailAddress, code) {
  const { to, subject, html } = getCodeMailData(mailAddress, code);
  await sendMail(to, subject, html);
}

function getRegisterSuccessMailData(mailAddress, userName = '') {
  const subject = '注册成功通知';
  const html = `  
    <h1>感谢您注册Wind账号：${userName}</h1>
    <p>祝您生活愉快。</p>
  `;

  return {
    to: mailAddress,
    subject,
    html,
  };
}

async function sendRegisterSuccessMail(mailAddress, userName = '') {
  const { to, subject, html } = getRegisterSuccessMailData(mailAddress, userName);
  await sendMail(to, subject, html);
}

export { sendMail, getCodeMailData, sendCodeMail, getRegisterSuccessMailData, sendRegisterSuccessMail };
