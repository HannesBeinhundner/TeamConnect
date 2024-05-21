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
        
        console.log(invitation);

        if (!invitation) {
            console.log(userEmail + " FALSE");
            return false;
        } else {
            console.log(userEmail + " TRUE");
            return true;
        }
    } catch (error) {
        console.error('Error joining project:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}