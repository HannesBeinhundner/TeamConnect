"use server"

import { ConfigurationSchema } from "@/app/lib/types";
import { prisma } from "@/prisma";
import { addMilestoneAction } from "./AddMilestoneAction";

export const addConfigurationAction = async (configurationData: unknown, milestonesData: unknown[]) => {
    // Validate the incoming configuration data against the schema
    const validationResult = ConfigurationSchema.safeParse(configurationData);
    if (!validationResult.success) {
        throw new Error('Invalid configuration data');
    }

    // Destructure the validated data
    const { name } = validationResult.data;

    try {
        // Create a new configuration entry in the database
        const newConfiguration = await prisma.configuration.create({
            data: {
                name,
            },
        });

        // Extract the configuration ID from the newly created configuration
        const configurationId = newConfiguration.id;

        // Call addMilestoneAction to add milestones associated with the configuration
        const milestoneResponse = await addMilestoneAction(configurationId, milestonesData);

        // Check if there were any errors while adding milestones
        if (milestoneResponse?.error) { // Optional chaining
            // Handle the error, rollback the transaction, etc.
            throw new Error(`Error adding milestones: ${milestoneResponse.error}`);
        }

        // Return the newly created configuration
        return newConfiguration;
    } catch (error) {
        // Handle errors, e.g., database errors
        console.error('Error adding configuration with milestones:', error);
        throw new Error('Failed to add configuration with milestones');
    }
};
