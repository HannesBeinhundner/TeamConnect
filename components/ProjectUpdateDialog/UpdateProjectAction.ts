'use server'

import { UpdateProjectSchema } from '@/app/lib/types';
import { UpdateProjectInputs } from '@/app/lib/types';
import { prisma } from '@/prisma';

export async function updateProject(inputData: UpdateProjectInputs, projectId: number) {
    console.log(inputData)
    const result = UpdateProjectSchema.safeParse(inputData);
    // console.log(result)

    try {

        if (!result.success) {
            return { success: false, error: 'Validation error. Check your input data.' };
        }

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
                description: inputData.projectDescription,
                skills: inputData.projectSkills,
                link: inputData.projectLink,
                file: inputData.projectFile || "undefined",
                image: inputData.projectImage || "undefined",
            },
        });

        return { success: true, data: updatedProject };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
