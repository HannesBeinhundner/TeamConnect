"use server"

import { MilestoneSchema } from "@/app/lib/types";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const addMilestoneAction = async (configurationId: number, milestones: unknown[]) => {
    const errors: string[] = [];

    for (let i = 0; i < milestones.length; i++) {
        const newMilestone = milestones[i];
        // Server-side validation for each milestone
        const result = MilestoneSchema.safeParse(newMilestone);
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                const errorMessage = `${issue.path[0]} (Milestone ${i + 1}): ${issue.message}`;
                errors.push(errorMessage);
            });
        } else {
            // If validation passes, add the milestone to the database
            try {
                await prisma.milestone.create({
                    data: {
                        ...result.data,
                        configurationId: configurationId // Associate the milestone with the configuration
                    }
                });
            } catch (error: any) {
                // Handle database errors
                errors.push(`Error adding Milestone ${i + 1}: ${error.toString()}`);
            }
        }
    }

    if (errors.length > 0) {
        return {
            error: errors.join("\n")
        };
    }

    revalidatePath("/configuration");
};
