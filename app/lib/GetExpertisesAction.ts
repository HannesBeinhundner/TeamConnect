'use server'

import { prisma } from "@/prisma";

export async function getExpertises(eventId: string | undefined) {
    try {
        const eventExpertises = await prisma.eventExpertise.findMany({
            where: {
                eventId: eventId,
            },
        });

        return eventExpertises;
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
