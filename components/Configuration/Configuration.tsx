"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { addConfigurationAction } from './AddConfigurationAction';
import { addMilestoneAction } from './AddMilestoneAction';
import { MilestoneSchema } from '@/app/lib/types';

interface Milestone {
    name: string;
    date: Date;
}

interface ConfigResponse {
    id: number;
    name: string;
}

export default function Configuration() {
    const [configName, setConfigName] = useState<string>('');
    const [milestones, setMilestones] = useState<Milestone[]>([{ name: '', date: new Date() }]);

    const handleInputChange = (index: number, field: keyof Milestone, value: string) => {
        const newMilestones = [...milestones];
        if (field === 'date') {
            newMilestones[index][field] = new Date(value);
        } else {
            newMilestones[index][field] = value;
        }
        setMilestones(newMilestones);
    };

    const clientAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            // Create Configuration if not already created
            let configId;
            const configResponse = await addConfigurationAction(configName);
            configId = configResponse.id;
    
            // Add Milestones if Configuration creation is successful
            if (configId) {
                const formattedMilestones = milestones.map(milestone => ({
                    ...milestone,
                    date: new Date(milestone.date)
                }));

                debugger
                await addMilestoneAction(configId, formattedMilestones);
                    toast.success('Configuration and milestones added successfully');
            } else {
                toast.error('Error creating configuration');
            }
        } catch (error:any) {
            toast.error('Error: ' + error.message);
        }
    };    

    

    const addMilestone = () => {
        setMilestones([...milestones, { name: '', date: new Date() }]);
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
                    onChange={(e) => setConfigName(e.target.value)} 
                    required
                />
                {milestones.map((milestone, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            placeholder="Milestone Name" 
                            value={milestone.name} 
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)} 
                            required
                        />
                        <input 
                            type="date" 
                            value={milestone.date.toISOString().split('T')[0]} // Format the date as YYYY-MM-DD
                            onChange={(e) => handleInputChange(index, 'date', e.target.value)} 
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
