'use server'

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export async function joinProject(session: any, projectId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session
            }
        });

        if (!user) {
            return { success: false, error: 'User not found.' };
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                projectId: projectId,
            },
        });

        if (user.email !== null) {
            await prisma.invitation.deleteMany({
                where: {
                    projectId: projectId,
                    email: user.email
                },
            });
        } else {
            console.error('Cannot delete invitations without a valid email.');
        }

        return { success: true, data: updatedUser };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}