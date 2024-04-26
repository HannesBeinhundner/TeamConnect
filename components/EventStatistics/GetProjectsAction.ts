'use server'

import { prisma } from '@/prisma';

export interface ProjectUserData {
  userCount: number;
}

export async function getProjectCnt(eventId: any) {

  const allProjects = await prisma.project.count({
    where: {
      eventId: eventId,
    },
  });

  return { allProjects };
  } 
