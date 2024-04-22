'use server'

import { prisma } from "@/prisma";

export async function getEvent(eventId: string) {
    try {
        const eventData = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });

        return eventData;
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
