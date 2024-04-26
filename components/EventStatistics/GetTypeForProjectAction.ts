'use server';

import { prisma } from '@/prisma';

export interface ChartData {
  type: string;
  itemCount: number;
}

export async function countProjectTypes(eventId: string): Promise<ChartData[]> {
  const projectTypeCounts = await prisma.project.groupBy({
    where: {
      eventId: eventId,
    },
    by: ['type'],
    _count: {
      _all: true,
    },
  });

  return projectTypeCounts.map(projectType => ({
    type: projectType.type,
    itemCount: projectType._count._all,
  }));
}
