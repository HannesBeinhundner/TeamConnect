'use server'

import { prisma } from "@/prisma";

export async function getInviteData(userEmail: any, projectId: any) {
    try {
        const invitation = await prisma.invitation.findFirst({
            where: {
                email: userEmail,
                projectId: projectId
            }
        });

        if (!invitation) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}