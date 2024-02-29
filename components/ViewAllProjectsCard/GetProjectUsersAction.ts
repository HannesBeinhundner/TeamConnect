'use server'

import { prisma } from "@/prisma";

export async function getProjectUsers(projectId: number) {
    try {
        if (!projectId) {
            return
        }

        const user = await prisma.user.count({
            where: {
                projectId: projectId,
            },
        });

        return user;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}