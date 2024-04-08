import { UserDataInterface } from "../types/MailData.types";

export class RegistrationEmail implements UserDataInterface {
  email: string;
  firstName: string;
  lastName: string;

  constructor(fields: UserDataInterface) {
    Object.assign(this, fields);
  }

  static getMailData(fields: UserDataInterface) {
    return {
      user: process.env.REGISTRATION_EMAIL_ADDRESS,
      to: fields.email,
      subject: 'Successfully Registered!',
      html: `<b>Hey there! </b><br> Thank you for registering, ${fields.firstName} ${fields.lastName}!<br/>`,
    }
  } 
}

