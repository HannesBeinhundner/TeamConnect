"use server"

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { Milestone } from "@/app/lib/types";

export const addConfigurationAction = async (configName: string) => {

    try {
        debugger
        const createConfig = await prisma.configuration.create({
            data: {
                name: configName,
            }
        })

        // Create milestones and associate them with the found configuration

        revalidatePath("/configuration");

        return createConfig;
    } catch (error) {
        console.error("Error adding milestones:", error);
        throw error; // Rethrow the error for higher-level handling
    }

}