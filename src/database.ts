import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

export const initializeDatabaseInstance = () => {
  prisma = new PrismaClient();
};
