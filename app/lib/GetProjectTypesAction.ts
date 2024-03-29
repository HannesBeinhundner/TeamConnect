'use server'

import { prisma } from "@/prisma";

export async function getProjectTypes(eventId: string | undefined) {
    try {
        const eventProjectTypes = await prisma.eventProjectType.findMany({
            where: {
                eventId: eventId,
            },
        });

        return eventProjectTypes;
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
