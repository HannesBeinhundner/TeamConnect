'use server'

import { prisma } from '@/prisma';

export async function removeUser(userId: any) {

    try {
        //Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return { success: false, error: 'User not found.' };
        }

        //If the user was a project admin, delete the project
        if (existingUser.projectAdmin && existingUser.projectId !== null) {
            const deletedProject = await prisma.project.delete({
                where: { id: existingUser.projectId },
            });

            if (!deletedProject) {
                return { success: false, error: 'Project could not be deleted.' };
            }
        }

        //Remove User from Event and from all projects
        const removedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                projectId: null,
                eventId: null,
                projectAdmin: false,
                description: null,
                expertise: null,
                link: null,
            },
        });

        if (!removedUser) {
            return { success: false, error: 'Event could not be deleted.' };
        }

        return { success: true, data: removedUser };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
