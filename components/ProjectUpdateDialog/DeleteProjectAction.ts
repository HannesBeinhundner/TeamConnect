'use server'

import { prisma } from '@/prisma';

export async function deleteProject(projectId: number) {

    try {
        //Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return { success: false, error: 'Project not found.' };
        }


        const users = await prisma.user.findMany({
            where: { projectId: projectId },
        });

        //Set projectAdmin to false for all users in the project before deleting the project
        for (const user of users) {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { projectAdmin: false },
            });

            if (!updatedUser) {
                return { success: false, error: 'User could not be updated.' };
            }
        }

        //Delete Project
        const deletedProject = await prisma.project.delete({
            where: { id: projectId },
        });

        if (!deletedProject) {
            return { success: false, error: 'Project could not be deleted.' };
        }

        return { success: true, data: deletedProject };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
