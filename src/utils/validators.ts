import { CustomHttpError } from '../errors.js';

export const INVALID_PASSWORD_MESSAGE =
  'A senha passada é inválida. Ela deve conter pelo menos 6 letras e ser composta por números e letras';
export const EXISTING_EMAIL_MESSAGE = 'Já existe um usuário cadastrado com este email';
export const INVALID_BIRTH_DATE_MESSAGE = 'A data de nascimento fornecida é inválida. O formato suportado é dd/mm/yyyy';
export const EMAIL_NOT_FOUND_MESSAGE = 'Não existe nenhum usuário com o email fornecido. Tente informar outro email';
export const INCORRECT_PASSWORD_MESSAGE = 'A senha fornecida está incorreta. Tente novamente';
export const UNAUTHORIZED_MESSAGE =
  'Operação não autorizada. É preciso realizar o login antes de realizar esta operação';
export const USER_ID_NOT_FOUND = 'Não existe nenhum usuário com o id fornecido. Tente informar outro id';

export const isPasswordValid = (password: string) => {
  if (!(passwordHasValidLenght(password) && passwordHasDigitsAndLetters(password))) {
    throw new CustomHttpError(400, INVALID_PASSWORD_MESSAGE);
  }
};

const passwordHasValidLenght = (password: string) => password.length > 5;

const passwordHasDigitsAndLetters = (password: string) => /[0-9]/.test(password) && /[A-Za-z]/.test(password);

export const isBirthDateValid = (birthDate: string) => {
  const BIRTH_DATE_REGEX = /^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;

  if (!BIRTH_DATE_REGEX.test(birthDate)) {
    throw new CustomHttpError(400, INVALID_BIRTH_DATE_MESSAGE);
  }
};
