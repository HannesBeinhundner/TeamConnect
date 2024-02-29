'use server'

import { UpdateProjectSchema } from '@/app/lib/types';
import { UpdateProjectInputs } from '@/app/lib/types';
import { prisma } from '@/prisma';

export async function updateProject(projectId: number, inputData: UpdateProjectInputs) {
    const result = UpdateProjectSchema.safeParse(inputData);

    try {

        if (!result.success) {
            return { success: false, error: 'Validation error. Check your input data.' };
        }

        // Retrieve the existing project from the database
        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return { success: false, error: 'Project not found.' };
        }

        // Update project fields with new values
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                name: inputData.projectName,
                type: inputData.projectType,
                supervisor: inputData.projectSupervisor,
                description: inputData.projectDescription,
                skills: inputData.projectSkills,
                link: inputData.projectLink,
            },
        });

        return { success: true, data: updatedProject };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
