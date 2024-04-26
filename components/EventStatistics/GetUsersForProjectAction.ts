'use server';

import { prisma } from '@/prisma';

export async function countSingleUserProjects(eventId: any): Promise<number> {
  const projectUserCounts = await prisma.user.groupBy({
    where: {
      eventId: eventId,
    },
    by: ['projectId'],
    _count: {
      projectId: true,
    }
  });

  const singleUserProjectCount = projectUserCounts.filter(project => project._count.projectId === 1).length;

  return singleUserProjectCount;
}
