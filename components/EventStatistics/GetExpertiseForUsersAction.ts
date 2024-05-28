'use server';

import { prisma } from '@/prisma';

export interface ChartData {
  type: string;
  itemCount: number;
}

export async function countUserExpertise(eventId: string): Promise<ChartData[]> {
  const userExpertiseCounts = await prisma.user.groupBy({
    where: {
      eventId: eventId,
    },
    by: ['expertise'],
    _count: {
      _all: true,
    },
  });

  return userExpertiseCounts.map(userExpertise => ({
    type: userExpertise.expertise ?? "Web",
    itemCount: userExpertise._count._all,
  }));
}
