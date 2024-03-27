'use server'

import { CreateEventSchema } from '@/app/lib/types'
import { CreateEventInputs } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function addEvent(inputData: CreateEventInputs, sessionEmail: string | null | undefined) {

    // const result = CreateEventSchema.safeParse(inputData);

    // try {
    //     if (result.success) {
    //         if (!sessionEmail) {
    //             return
    //         }

    //         const user = await prisma.user.findUnique({
    //             where: {
    //                 email: sessionEmail,
    //             },
    //         })

    //         //Create Event
    //         const createdProject = await prisma.event.create({
    //             data: {
    //                 name: inputData.projectName,
    //                 isPartOfEvent: inputData.projectType,
    //                 hasMilestones: inputData.projectSupervisor,
    //             },
    //             select: {
    //                 id: true, // Include the 'id' field in the selection
    //             },
    //         });

    //         //Insert ProjectID to User and set Admin to true
    //         const updateUser = await prisma.user.update({
    //             where: {
    //                 email: sessionEmail,
    //             },
    //             data: {
    //                 projectId: createdProject.id,
    //                 projectAdmin: true
    //             },
    //         })

    //         return { success: true, data: result.data };
    //     }
    // } catch (error: any) {
    //     if (error.code === 'P2002') {
    //         // Unique constraint violation error (P2002)
    //         return { success: false, error: 'Project name must be unique.' };
    //     }

    //     console.error(error);
    //     return { success: false, error: 'An unexpected error occurred.' };
    // }

    // if (result.error) {
    //     return { success: false, error: result.error.format() }
    // }

    // return { success: false, error: 'Unknown error occurred.' };
}