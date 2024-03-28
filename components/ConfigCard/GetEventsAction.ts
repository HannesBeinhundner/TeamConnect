'use server'

import { prisma } from "@/prisma";

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

        //Get amount of users that are part of all projects in the event
        const eventsWithUsersCount = events.map((event) => {
            // Get an array of all users in all projects
            const allUsers = event.Project.flatMap((project) => project.User);
            const allProjects = event.Project;

            return {
                ...event,
                usersCount: allUsers.length, // Get the count of users
                projectsCount: allProjects.length, // Get the count of projects
            };
        });

        return eventsWithUsersCount;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
