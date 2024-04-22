'use server'

import { prisma } from "@/prisma";

async function getEventUsersCount(eventId: string) {
    const allUsers = await prisma.user.findMany({
        where: {
            eventId: eventId,
        },
    });
    return allUsers
}

export async function getEvents(sessionEmail: string | null | undefined) {
    try {

        if (!sessionEmail) {
            return;
        }

        //Get all events that the user is admin of
        const events = await prisma.event.findMany({
            where: {
                adminEmail: sessionEmail,
            },
            include: {
                EventProjectType: true,
                EventExpertise: true,
                Project: {
                    include: {
                        User: true, // Include the related users in the response
                    },
                },
            },
        });

        //Get amount of users and projects that are part of the event
        const eventsWithUsersCount = await Promise.all(events.map(async (event) => {
            const allUsers = await getEventUsersCount(event.id);
            const allProjects = event.Project;

            return {
                ...event,
                usersCount: allUsers.length, // Get the count of users
                projectsCount: allProjects.length, // Get the count of projects
            };
        }));

        return eventsWithUsersCount;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}



