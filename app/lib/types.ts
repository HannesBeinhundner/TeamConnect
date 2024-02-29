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
    projectType: z.string().min(1, { message: 'Project type is required' }),
    projectSupervisor: z.string().min(1, { message: 'Project supervisor is required' }),
    projectLink: z.string().max(256, { message: 'Portfolio link is too long' }),
    projectDescription: z.string().min(1, { message: 'Project description is required' }).max(1000, { message: 'Project description is too long' }),
    projectSkills: z.string().max(1000, { message: 'Preffered skills and study program is too long' }),
});

export type CreateProjectInputs = z.infer<typeof CreateProjectSchema>

export const UpdateProjectSchema = z.object({
    projectName: z.string().min(1, { message: 'Project name is required' }),
    projectType: z.string().min(1, { message: 'Project type is required' }),
    projectSupervisor: z.string().min(1, { message: 'Project supervisor is required' }),
    projectDescription: z.string().min(1, { message: 'Project description is required' }).max(1000, { message: 'Project description is too long' }),
    projectSkills: z.string().max(1000, { message: 'Preffered skills and study program is too long' }),
    projectLink: z.string().max(256, { message: 'Portfolio link is too long' }),
});
export type UpdateProjectInputs = z.infer<typeof UpdateProjectSchema>;