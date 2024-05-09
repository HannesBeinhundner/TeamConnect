'use server'

import { prisma } from "@/prisma";

export async function checkProject(projectId: any) {
    try {
        const users = await prisma.user.findMany({
            where: {
                projectId: projectId,
            },
        })
        if (users) {
            //project = { ...project, users: joinedUsers };
            return users;
        }

        return false;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}