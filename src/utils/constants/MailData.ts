import { UserDataInterface } from "types/MailData.types"

export const getMailData = (userData: UserDataInterface ) => {
  const {email ,firstName, lastName} = userData
  return {
    user: process.env.REGISTRATION_EMAIL_ADDRESS,
    to: email,
    subject: 'Successfully Registered!',
    html: `<b>Hey there! </b><br> Thank you for registering, ${firstName} ${lastName}!<br/>`,
  }
}