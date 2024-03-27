'use server'

import { prisma } from '@/prisma';

export async function deleteEvent(eventId: string) {

    try {
        //Check if event exists
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!existingEvent) {
            return { success: false, error: 'Event not found.' };
        }

        //Delete Event
        const deletedEvent = await prisma.event.delete({
            where: { id: eventId },
        });

        if (!deletedEvent) {
            return { success: false, error: 'Event could not be deleted.' };
        }

        return { success: true, data: deletedEvent };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
