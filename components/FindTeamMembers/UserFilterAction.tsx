'use server'

import { FindTeamMemberInputs, FindTeamMemberSchema } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function UserFilter(inputData: FindTeamMemberInputs, eventId: any) {

    console.log(inputData)
    const result = FindTeamMemberSchema.safeParse(inputData);

    try {
        if (result.success) {

            const filter: any = {};
            filter.eventId = eventId;

            if (inputData.memberSearch) {
                filter.name = {
                    contains: inputData.memberSearch
                };
            }
            if (inputData.studyProgram) {
                filter.major = inputData.studyProgram;
            }

            filter.status = "STUD";

            const users = await prisma.user.findMany({
                where: filter
            });

            return { success: true, data: users };
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