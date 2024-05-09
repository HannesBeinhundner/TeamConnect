'use server'

import { prisma } from '@/prisma';

export async function removeUserFromProject(userId: any) {

    try {
        //Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return { success: false, error: 'User not found.' };
        }

        //Remove User from the project
        const removedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                projectId: null,
                projectAdmin: false,
            },
        });

        if (!removedUser) {
            return { success: false, error: 'User could not be removed.' };
        }

        return { success: true, data: removedUser };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
