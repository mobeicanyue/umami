import prisma from 'lib/prisma';

export async function getVisitor(id: string) {
  return prisma.client.visitor.findUnique({
    where: {
      id,
    },
  });
}
