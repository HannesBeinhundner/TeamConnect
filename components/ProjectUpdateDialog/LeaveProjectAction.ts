'use server'

import { prisma } from '@/prisma';

export async function leaveProject(projectId: number, userId: string) {

    try {
        //Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return { success: false, error: 'Project not found.' };
        }

        //Remove user from Project
        const removedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                project: {
                    disconnect: {
                        id: projectId,
                    },
                },
            },
        });

        if (!removedUser) {
            return { success: false, error: 'Project could not be deleted.' };
        }

        return { success: true, data: removedUser };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
