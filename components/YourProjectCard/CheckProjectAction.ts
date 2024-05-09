'use server'

import { prisma } from "@/prisma";

export async function checkProject(sessionEmail: string | null | undefined, eventId: any) {
    try {
        if (!sessionEmail) {
            return
        }

        const user = await prisma.user.findUnique({
            where: {
                email: sessionEmail,
            },
        })

        if (user?.projectId) {
            let project = await prisma.project.findUnique({
                where: {
                    id: user.projectId,
                    eventId: eventId,
                },
            })

            if (project) {
                const joinedUsers = await prisma.user.findMany({
                    where: {
                        projectId: project.id,
                    },
                })
                if (joinedUsers) {
                    //project = { ...project, users: joinedUsers };
                    return { ...project, currentUser: user, users: joinedUsers };
                }

            }
        }

        return false;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}