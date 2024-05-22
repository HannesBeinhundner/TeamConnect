import { prisma } from '@/prisma';

export async function confirmInvitation(token: string) {
    try {
        // Find the invitation by token
        const invitation = await prisma.invitation.findUnique({
            where: { token }
        });

        if (!invitation || invitation.expiresAt < new Date()) {
            console.error("Invalid or expired token:", token);
            return { success: false, error: 'Invalid or expired token.' };
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: invitation.email }
        });

        if (!user) {
            console.error("User not found:", invitation.email);
            return { success: false, error: 'User not found.' };
        }

        // Update the user's projectId
        await prisma.user.update({
            where: { email: invitation.email },
            data: { projectId: invitation.projectId }
        });

        // Delete the invitation after use
        await prisma.invitation.delete({
            where: { id: invitation.id }
        });

        return { success: true, userEmail: user.email };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
