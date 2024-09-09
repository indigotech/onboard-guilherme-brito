export interface LoginInput {
  email: string;
  password: string;
}

export const loginResolver = (_, args: { data: LoginInput }) => {
  return {
    user: {
      id: 13,
      name: 'guilherme',
      email: 'teste@taqtile.com.br',
      birthDate: '25/04/2003',
    },
    token: 'mockToken',
  };
};
