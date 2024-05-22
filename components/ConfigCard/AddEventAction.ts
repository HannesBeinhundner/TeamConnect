'use server'

import { CreateEventSchema } from '@/app/lib/types'
import { CreateEventInputs } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function addEvent(inputData: CreateEventInputs, sessionEmail: string | null | undefined) {

    const result = CreateEventSchema.safeParse(inputData)

    try {
        if (result.success) {
            if (!sessionEmail) {
                return
            }

            //Create Event
            const createdEvent = await prisma.event.create({
                data: {
                    name: inputData.eventName,
                    adminEmail: sessionEmail,
                },
                select: {
                    id: true, // Include the 'id' field in the selection
                },
            });

            //Transforms each string in the array into an object
            const eventProjectTypeData = inputData.eventProjectType.map(name => ({
                eventId: createdEvent.id,
                name: name,
            }));

            //Insert ProjectType to Event
            const eventProjectType = await prisma.eventProjectType.createMany({
                data: eventProjectTypeData,
            });

            //Transforms each string in the array into an object
            const eventExpertiseData = inputData.eventExpertise.map(name => ({
                eventId: createdEvent.id,
                name: name,
            }));

            //Insert Expertise to Event
            const eventExpertise = await prisma.eventExpertise.createMany({
                data: eventExpertiseData,
            });

            return { success: true, data: result.data };
        }
    } catch (error: any) {
        return { success: false, error: 'An unexpected error occurred.' };
    }

    if (result.error) {
        return { success: false, error: result.error.format() }
    }

    return { success: false, error: 'Unknown error occurred.' };
}