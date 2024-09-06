import { prisma } from '../database.js';
import { CustomHttpError } from '../errors.js';

export const isPasswordValid = (password: string) => {
  if (!(passwordHasValidLenght(password) && passwordHasDigitsAndLetters(password))) {
    throw new CustomHttpError(
      400,
      `A senha passada é inválida. Ela deve conter pelo menos 6 letras e ser composta por números e letras`,
    );
  }
};

const passwordHasValidLenght = (password: string) => password.length > 5;

const passwordHasDigitsAndLetters = (password: string) => /[0-9]/.test(password) && /[A-Za-z]/.test(password);

export const isEmailUnique = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new CustomHttpError(400, `Já existe um usuário cadastrado com este email`);
  }
};

export const isBirthDateValid = (birthDate: string) => {
  const BIRTH_DATE_REGEX = /^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;

  if (!BIRTH_DATE_REGEX.test(birthDate)) {
    throw new CustomHttpError(400, `A data de nascimento fornecida é inválida. O formato suportado é dd/mm/yyyy`);
  }
};
