'use server'

import { CreateEventSchema } from '@/app/lib/types';
import { CreateEventInputs } from '@/app/lib/types';
import { prisma } from '@/prisma';

export async function updateEvent(inputData: CreateEventInputs, eventId: string) {
    console.log(inputData)
    const result = CreateEventSchema.safeParse(inputData);

    try {
        if (!result.success) {
            return { success: false, error: 'Validation error. Check your input data.' };
        }

        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!existingEvent) {
            return { success: false, error: 'Event not found.' };
        }

        // Start a transaction
        const transaction = await prisma.$transaction([
            // Update the Event
            prisma.event.update({
                where: { id: eventId },
                data: {
                    name: inputData.eventName,
                },
            }),
            // Update or create EventProjectTypes
            ...inputData.eventProjectType.map((name) =>
                prisma.eventProjectType.upsert({
                    where: { eventId_name: { eventId: eventId, name: name } },
                    update: { name: name },
                    create: { name: name, eventId: eventId },
                })
            ),
            // Update or create EventExpertises
            ...inputData.eventExpertise.map((name) =>
                prisma.eventExpertise.upsert({
                    where: { eventId_name: { eventId: eventId, name: name } },
                    update: { name: name },
                    create: { name: name, eventId: eventId },
                })
            ),
        ]);

        return { success: true, data: transaction[0] }; // Return the updated event
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
