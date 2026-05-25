import { PrismaClient, Role, SourceType, ReservationStatus, CleaningStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin',
      passwordHash,
      role: Role.admin,
    },
  });

  await prisma.user.upsert({
    where: { email: 'clean' },
    update: {},
    create: {
      name: 'Equipo de Limpieza',
      email: 'clean',
      passwordHash: await bcrypt.hash('clean123', 10),
      role: Role.cleaning,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
