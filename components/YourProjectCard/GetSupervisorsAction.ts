'use server'

import { prisma } from '@/prisma';

export async function getSupervisors() {
    try {
        const supervisors = await prisma.user.findMany({
            where: { status: "LBA" },
        });

        if (!supervisors) {
            return { success: false, error: 'Project not found.' };
        }

        console.log(supervisors)
        return { success: true, data: supervisors };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
