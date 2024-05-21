 'use server'

import { prisma } from '@/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_KEY);

export async function inviteUserToProject(eventId: any, sessionEmail: any, userEmail: string, projectId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: sessionEmail
            }
        });

        if (!user || user.projectId === null) {
            return { success: false, error: 'User not found or does not have a project ID.' };
        }

        // Generate a unique token for the invitation
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

        // Store the invitation in the database
        await prisma.invitation.create({
            data: {
                email: userEmail,
                projectId: user.projectId || 0, // Use a default value if user.projectId is null
                token: token,
                expiresAt: expiresAt
            }
        });

        // Generate the confirmation link
        console.log(eventId)
        const confirmationLink = `https://team-connect.app/${eventId}/confirm-invitation?token=${token}`;

        // Send the invitation email using resend
        await resend.emails.send({
            from: 'no-reply@team-connect.app',
            to: userEmail,
            subject: 'Invitation to Join Project',
            html: `<p>You have been invited to join a project. Click <a href="${confirmationLink}">here</a> to confirm.</p>`
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
