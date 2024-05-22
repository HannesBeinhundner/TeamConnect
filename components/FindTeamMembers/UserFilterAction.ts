'use server'

import { FindTeamMemberInputs, FindTeamMemberSchema } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function UserFilter(inputData: FindTeamMemberInputs, eventId: any) {

    const result = FindTeamMemberSchema.safeParse(inputData);

    try {
        if (result.success) {

            const filter: any = {};
            filter.eventId = eventId;

            if (inputData.memberSearch) {
                filter.name = {
                    contains: inputData.memberSearch,
                    mode: 'insensitive'
                };
            }
            if (inputData.expertise) {
                filter.expertise = {
                    contains: inputData.expertise
                };
            }

            const users = await prisma.user.findMany({
                where: filter
            });

            return { success: true, data: users };
        }
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }

    if (result.error) {
        return { success: false, error: result.error.format() }
    }

    return { success: false, error: 'Unknown error occurred.' };
}