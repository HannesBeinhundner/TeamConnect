'use server'

import { prisma } from "@/prisma";

export async function getUser(sessionEmail: string) {
    try {
        if (!sessionEmail) {
            return
        }

        const user = await prisma.user.findUnique({
            where: {
                email: sessionEmail,
            },
        });

        return user;

    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}