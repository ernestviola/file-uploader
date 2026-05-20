import expressSession from 'express-session';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const prismaSession = expressSession({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export { prismaSession };
