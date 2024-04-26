'use server'

import { prisma } from '@/prisma';

export interface ProjectUserData {
  userCount: number;
  usersWithoutProject: number;
  teamlessProjects: number;
}

export async function getUserCnt(eventId: any) {

    const userCount = await prisma.user.count({
      where: {
        eventId: eventId,
      },
    });

    const usersWithoutProject = await prisma.user.count({
      where: {
        eventId: eventId,
        projectId: null,
      },
    });

    return { userCount, usersWithoutProject };
  } 
