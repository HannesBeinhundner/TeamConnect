"use server"

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { Milestone } from "@/app/lib/types";

export const addMilestoneAction = async (configId: number, milestones: Milestone[]) => {
    try {
        
        const createdMilestones = await Promise.all(
            milestones.map(async (milestone) => {
                const newMilestone = await prisma.milestone.create({
                    data: {
                        ...milestone,
                        configurationId: configId,
                    },
                });
                return newMilestone;
            })
        );

        revalidatePath("/configuration");

        return { success: true };
    } catch (error) {
        console.error("Error adding milestones:", error);
        throw error;
    }
};
