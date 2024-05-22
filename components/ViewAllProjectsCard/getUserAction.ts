'use server'

import { prisma } from "@/prisma";

export async function getUserData(session: any) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session
            }
        });

        if (!user) {
            return { success: false, error: 'User not found.' };
        }

        return user;
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}