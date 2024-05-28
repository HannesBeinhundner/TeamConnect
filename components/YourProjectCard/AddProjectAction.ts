'use server'

import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { prisma } from "@/prisma";

export async function addEntry(inputData: CreateProjectInputs, sessionEmail: string | null | undefined, eventId: any) {

    const result = CreateProjectSchema.safeParse(inputData);

    try {
        if (result.success) {
            if (!sessionEmail) {
                return
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: sessionEmail,
                },
            })

            if (user?.projectId != null) {
                return { success: false, error: 'A User can only create or be part of one project at a time' };
            }

            //Create Project
            const createdProject = await prisma.project.create({
                data: {
                    name: inputData.projectName,
                    type: inputData.projectType,
                    description: inputData.projectDescription,
                    skills: inputData.projectSkills,
                    file: inputData.projectFile || "undefined",
                    image: inputData.projectImage || "undefined",
                    link: inputData.projectLink,
                    eventId: eventId,
                },
                select: {
                    id: true, // Include the 'id' field in the selection
                },
            });

            //Insert ProjectID to User and set Admin to true
            const updateUser = await prisma.user.update({
                where: {
                    email: sessionEmail,
                },
                data: {
                    projectId: createdProject.id,
                    projectAdmin: true
                },
            })

            return { success: true, data: result.data };
        }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'Project name must be unique.' };
        }

        return { success: false, error: 'An unexpected error occurred.' };
    }

    return { success: false, error: 'Unknown error occurred.' };
}