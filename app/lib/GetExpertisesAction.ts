'use server'

import { prisma } from "@/prisma";

export async function getExpertises(eventId: string | undefined) {
    try {

        // If eventId is not provided, return empty array (for first time admins)
        if (!eventId) {
            return [];
        }
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
