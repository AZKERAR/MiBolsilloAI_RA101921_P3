import { prisma } from '../../../lib/prisma.ts';

export function listCategories(userId: string) {
  return prisma.category.findMany({ where: { userId }, orderBy: { name: 'asc' } });
}

export function createCategory(
  userId: string,
  dto: { name: string; icon?: string; color?: string }
) {
  return prisma.category.create({ data: { userId, ...dto } });
}

export async function updateCategory(
  userId: string,
  id: string,
  dto: Partial<{ name: string; icon?: string; color?: string }>
) {
  await prisma.category.findFirstOrThrow({ where: { id, userId } });
  return prisma.category.update({ where: { id }, data: dto });
}

export async function deleteCategory(userId: string, id: string) {
  await prisma.category.findFirstOrThrow({ where: { id, userId } });
  await prisma.transaction.updateMany({
    where: { userId, categoryId: id },
    data: { categoryId: null },
  });
  return prisma.category.delete({ where: { id } });
}