'use server'
import { z } from 'zod'
import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { NextResponse } from 'next/server'
import { prisma } from "@/prisma";
import { Prisma } from '@prisma/client'

export async function addEntry(inputData: CreateProjectInputs) {
    const result = CreateProjectSchema.safeParse(inputData);

    try {
        if (result.success) {
            await prisma.project.create({
                data: {
                    name: inputData.projectName,
                    type: inputData.projectType,
                    supervisor: inputData.projectSupervisor,
                    description: inputData.projectDescription,
                    skills: inputData.projectSkills,
                    file: "testFile",
                    image: "testImage",
                    link: inputData.projectLink,
                    status: "not accepted"
                }
            });

            return { success: true, data: result.data };
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            // Unique constraint violation error (P2002)
            return { success: false, error: 'Project name must be unique.' };
        }

        // Handle other errors if needed
        console.error(error);
        return { success: false, error: 'An unexpected error occurred.' };
    }

    if (result.error) {
        return { success: false, error: result.error.format() }
    }

    return { success: false, error: 'Unknown error occurred.' };
}