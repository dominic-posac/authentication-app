import bcrypt from "bcryptjs"

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash
}

export const checkPassword = async (password: string, hash: string) => {
  const isPasswordSame = await bcrypt.compare(password, hash);
  return isPasswordSame
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