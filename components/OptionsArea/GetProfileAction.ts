'use server'

import { prisma } from '@/prisma';

export async function getProfile(userEmail: string) {
    try {
        const userProfile = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        return { success: true, data: userProfile };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
