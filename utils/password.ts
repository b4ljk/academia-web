import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const saltAndHashPassword = async (pass: string) => {
  const hashedPassword = await bcrypt.hash(pass, 10);
  return hashedPassword;
};

export const getUserFromDb = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  const passwordMatch = await bcrypt.compare(password, user?.password ?? '');

  if (!passwordMatch) {
    return null;
  }

  return user;
};
