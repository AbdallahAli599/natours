const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
require('dotenv').config({ path: './config.env' });

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Abdallah <${process.env.EMAIL_FROM}>`;
  }

  async send(subject, message) {
    const template =
      subject === 'Welcome to the Natours Family!'
        ? 'welcome'
        : 'passwordReset';
    // 0) Render HTML based on a bug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 1) Create a transporter
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      // 1) Create a transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: false,
        tls: { rejectUnauthorized: false },
      });
    }

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Actually send the email
    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      'Welcome to the Natours Family!',
      `Hello ${this.firstName},\n\nWelcome to the Natours family! We are excited to have you on board.\n\nBest regards,\nThe Natours Team`
    );
  }

  async sendPasswordReset() {
    await this.send(
      'Your password reset token (valid for only 10 minutes)',
      `Hello ${this.firstName},\n\nYou requested a password reset. Please use the following link to reset your password:\n\n${this.url}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe Natours Team`
    );
  }
};
