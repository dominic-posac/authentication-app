import crypto from 'crypto';

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.AUTHENTICATION_SECRET || '').digest('hex')
}

export const normalizeCamelCase = (text: string) => {
  const capitalizedInnerFirstLetters = text.replace(/([A-Z])/g, ' $1');
  return capitalizedInnerFirstLetters.charAt(0).toUpperCase() + capitalizedInnerFirstLetters.slice(1);
}

export interface FieldsInterface {
  [key: string]: string
}

export const checkMissingFields = ( fieldsFromReq: FieldsInterface, fieldDataArray: FieldsInterface[] ) => {
  const missingFieldsArray: FieldsInterface[] = []
  fieldDataArray.map(fieldData => {
    const field = fieldData.field as keyof FieldsInterface
    if(!fieldsFromReq[field]) {
      missingFieldsArray.push(fieldData)
    }
  })
  return missingFieldsArray
}