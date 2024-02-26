"use client"

import toast from "react-hot-toast";
import { addConfigurationAction } from "./AddConfigurationAction"; // Import the action to add a configuration with milestones
import styles from "./Configuration.module.scss";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ConfigurationSchema, MilestoneSchema } from "@/app/lib/types";

interface Milestone {
    name: string;
    date: Date;
}

export default function Configuration() {
    const [milestones, setMilestones] = useState<Milestone[]>([{ name: '', date: new Date() }]);
    const [configName, setConfigName] = useState<string>('');

    const clientAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Client-side validation for configuration
        const configResult = ConfigurationSchema.safeParse({ name: configName });
        if (!configResult.success) {
            const errorMessage = configResult.error.issues.map(issue => issue.message).join('\n');
            toast.error(errorMessage);
            return;
        }
    
        // Client-side validation for each milestone
        const validationErrors: string[] = [];
        milestones.forEach((milestone, index) => {
            const result = MilestoneSchema.safeParse(milestone);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    const errorMessage = `${issue.path[0]} (Milestone ${index + 1}): ${issue.message}`;
                    validationErrors.push(errorMessage);
                });
            }
        });
    
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(error));
            return;
        }
    
        // Prepare configuration data
        const configurationData = { name: configName };
    
        // Prepare milestones data
        const milestonesData = milestones.map(milestone => ({
            name: milestone.name,
            date: milestone.date // Pass Date object directly
        }));
    
        try {
            // Send configuration data and milestones data to the backend
            const newConfiguration = await addConfigurationAction(configurationData, milestonesData);
    
            // Handle success
            console.log('New configuration created:', newConfiguration);
            // You may navigate to another page, show a success message, etc.
        } catch (error) {
            // Handle error
            console.error('Error creating configuration:', error);
            toast.error('Failed to create configuration. Please try again later.');
        }
    };
    

    const addMilestone = () => {
        setMilestones([...milestones, { name: '', date: new Date() }]); // Initialize date with new Date()
    };

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>, fieldName: keyof Milestone) => {
        const { value } = event.target;
        const newMilestones = [...milestones];

        // Convert date string to Date object
        if (fieldName === 'date') {
            newMilestones[index][fieldName] = new Date(value);
        } else {
            newMilestones[index][fieldName] = value;
        }

        setMilestones(newMilestones);
    };

    const handleConfigNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfigName(event.target.value);
    };

    return (
        <main>
            <h1>Import Settings</h1>
            <span>Here you can individually create your TeamConnect project. Start by declaring all the milestones you need to keep your team finding process experience like you want it.</span>
            <form onSubmit={clientAction} method="post">
                <input 
                    type="text" 
                    placeholder="Configuration Name" 
                    value={configName} 
                    onChange={handleConfigNameChange} 
                    name="configName" 
                    required
                />
                {milestones.map((milestone, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            placeholder="Milestone Name" 
                            name={`milestoneName-${index}`} 
                            value={milestone.name} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e, 'name')} 
                            required
                        />
                        <input 
                            type="date" 
                            name={`milestoneDate-${index}`} 
                            value={milestone.date.toISOString().split('T')[0]} // Format the date as YYYY-MM-DD
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e, 'date')} 
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addMilestone}>Add Milestone</button>
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}
