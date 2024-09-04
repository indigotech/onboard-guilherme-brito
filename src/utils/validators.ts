import prisma from '../prisma-client.js';

export const isPasswordValid = (password: string) => {
  if (!(passwordHasValidLenght(password) && passwordHasDigitsAndLetters(password))) {
    throw new Error(
      `A senha ${password} é inválida. Ela deve conter pelo menos 6 letras e ser composta por números e letras`,
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
    throw new Error(`Já existe um usuário cadastrado com o email ${email}`);
  }
};

export const isBirthDateValid = (birthDate: string) => {
  if (!/^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/.test(birthDate)) {
    throw new Error(`A data ${birthDate} é inválida. O formato suportado é dd/mm/yyyy`);
  }
};
