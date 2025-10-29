import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear rol "user" si no existe
  const userRole = await prisma.role.upsert({
    where: { code: 'user' },
    update: {},
    create: {
      code: 'user',
      name: 'User',
    },
  });

  console.log('✅ Rol creado:', userRole);

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
