'use server'

import { prisma } from '@/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg';


const resend = new Resend(process.env.RESEND_KEY);

export async function inviteUserToProject(eventData: any, sessionEmail: any, userEmail: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: sessionEmail
            }
        });

        if (!user || user.projectId === null) {
            return { success: false, error: 'User not found or does not have a project ID.' };
        }

        //Get Project from the admin
        const project = await prisma.project.findUnique({
            where: {
                id: user.projectId
            }
        });

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
        const confirmationLink = `https://team-connect.app/${eventData.id}/confirm-invitation?token=${token}`;

        // Send the invitation email using resend
        await resend.emails.send({
            from: 'no-reply@team-connect.app',
            to: userEmail,
            subject: 'Invitation to Join Project',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
            <a href="https://team-connect.app/">
                    <img
                        src="https://utfs.io/f/1c62eed8-a76b-467c-8332-083579ed3573-x6zvat.png"
                        alt="TeamConnect Logo"
                        style="width: 300px;"
                    />
                </a>
                <h2 style="color: #333;">Invitation to Join Project</h2>
                <p style="color: #333; font-size: 16px;">You have been invited by ${user.name} to join the Project "${project?.name}" of ${eventData.name}.</p>
                <p style="color: #333; font-size: 16px;">Click <a href="${confirmationLink}" style="color: #1a0dab;">here</a> to confirm.</p>
                <p style="color: #333; font-size: 16px;"><strong>Project Description:</strong> ${project?.description}<p/>
            </div>
            `
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
