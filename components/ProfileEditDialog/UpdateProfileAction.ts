'use server'

import { UpdateProfileSchema } from '@/app/lib/types';
import { UpdateProfileInputs } from '@/app/lib/types';
import { prisma } from '@/prisma';

export async function updateProfile(inputData: UpdateProfileInputs, userEmail: string) {
    const result = UpdateProfileSchema.safeParse(inputData);

    try {
        if (!result.success) {
            return { success: false, error: 'Validation error. Check your input data.' };
        }

        // Update profile fields with new values
        const updatedProfile = await prisma.user.update({
            where: { email: userEmail },
            data: {
                name: inputData.profileName,
                major: inputData.profileExpertise,
                description: inputData.profileDescription,
            },
        });

        return { success: true, data: updatedProfile };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
