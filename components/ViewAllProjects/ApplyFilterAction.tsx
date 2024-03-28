'use server'

import { ApplyFilterInputs, ApplyFilterSchema } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function ApplyFilter(inputData: ApplyFilterInputs, eventId: any) {

    console.log(inputData)
    const result = ApplyFilterSchema.safeParse(inputData);

    try {
        if (result.success) {

            // const user = await prisma.user.findUnique({
            //     where: {
            //         email: sessionEmail,
            //     },
            // })

            const filter: any = {};
            filter.eventId = eventId;

            if (inputData.projectSearch) {
                filter.name = {
                    contains: inputData.projectSearch
                };
            }
            if (inputData.projectType) {
                filter.type = inputData.projectType;
            }
            if (inputData.projectStatus) {
                filter.status = inputData.projectStatus;
            }

            const projects = await prisma.project.findMany({
                where: filter
            });

            console.log(projects);

            return { success: true, data: projects };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }

    if (result.error) {
        return { success: false, error: result.error.format() }
    }

    return { success: false, error: 'Unknown error occurred.' };
}