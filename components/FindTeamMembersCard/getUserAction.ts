'use server'
 
import { prisma } from "@/prisma";
 
export async function getCurrentUserData(session: any) {
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
        console.error('Error joining project:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}