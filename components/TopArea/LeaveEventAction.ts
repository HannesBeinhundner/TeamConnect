'use server'

import { prisma } from "@/prisma";

export async function leaveEvent(userEmail: string, eventId: string) {
    try {
        if (!eventId) {
            return
        }

        // Remove the user from the event
        await prisma.user.update({
            where: { email: userEmail },
            data: {
                eventId: null
            }
        });


        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        //Delete the project if the user is the project admin
        if (user?.projectAdmin && user.projectId) {
            await prisma.project.delete({
                where: { id: user.projectId }
            });

        } else {
            //Remove the user from the project if the user is not the project admin
            await prisma.user.update({
                where: { email: userEmail },
                data: {
                    projectId: null
                }
            });
        }

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}