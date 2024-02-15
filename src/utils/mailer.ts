import nodemailer from 'nodemailer';
import { MailDataInterface } from 'types/MailData.types';

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth:{
      user: process.env.REGISTRATION_EMAIL_ADDRESS,
      pass: process.env.REGISTRATION_EMAIL_PASSWORD,
    }
  }
);

export const sendRegistrationEmail = async (mailData: MailDataInterface) => {
  try {
    await transporter.sendMail(mailData);
  } catch (error) {
    return error
  }
}

