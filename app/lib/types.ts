import { z } from "zod";

export const MilestoneSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "The name of the milestone must be given." }).max(50, { message: "The name of the milestone is too long (50 characters max.)" }),
    date: z.date()
})

export type Milestone = z.infer<typeof MilestoneSchema>;

export const ConfigurationSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1).max(50),
    milestones: z.array(MilestoneSchema)
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

export const CreateProjectSchema = z.object({
    projectName: z.string().min(1, { message: 'Project name is required' }),
});

export type CreateProjectInputs = z.infer<typeof CreateProjectSchema>