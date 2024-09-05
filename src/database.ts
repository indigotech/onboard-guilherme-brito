import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

export const startDatabase = () => {
  prisma = new PrismaClient();
};
