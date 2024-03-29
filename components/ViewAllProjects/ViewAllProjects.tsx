"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import styles from "./ViewAllProjects.module.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplyFilterInputs, ApplyFilterSchema, CreateProjectSchema } from '@/app/lib/types'
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ApplyFilter } from './ApplyFilterAction';
import ViewAllProjectsCard from '../ViewAllProjectsCard/ViewAllProjectsCard';
import { getProjectTypes } from '@/app/lib/GetProjectTypesAction';

export default function ViewAllProjects({ eventId }: { eventId: any }) {
    const [projectsResult, setProjectsResult] = useState<any>({});
    const [projectTypes, setProjectTypes] = useState<any>([]);


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = {
                    projectSearch: "",
                    projectType: "",
                    projectStatus: "",
                };
                const response = await ApplyFilter(data, eventId);

                if (response.success && Array.isArray(response.data)) {
                    setProjectsResult(response.data);
                } else {
                    console.error('Error: ApplyFilter did not return a successful response or data is not an array.');
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        const fetchProjectTypes = async () => {
            const projectTypes: any = await getProjectTypes(eventId);
            setProjectTypes(projectTypes);
        };

        fetchProjects();
        fetchProjectTypes();
    }, []);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm<ApplyFilterInputs>({
        resolver: zodResolver(ApplyFilterSchema)
    })

    const processForm: SubmitHandler<ApplyFilterInputs> = async data => {
        try {
            // Call ApplyFilter with form data
            const filteredProjects = await ApplyFilter(data, eventId);

            if (filteredProjects && filteredProjects.success && Array.isArray(filteredProjects.data)) {
                // Set the filtered project data
                setProjectsResult(filteredProjects.data);
            } else {
                // Handle error if ApplyFilter didn't return expected data
                console.error('Error: ApplyFilter did not return the expected data.');
            }
        } catch (error) {
            console.error('Error processing form:', error);
            // Handle error if there's an issue with ApplyFilter or resetting the form
            alert("Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>View All Projects</h5>
            </div>
            <div className={styles.contentArea}>
                <form onSubmit={handleSubmit(processForm)} className={styles.filterArea}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', minWidth: "22%" }}>
                        <SearchIcon
                            sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                        />
                        <TextField
                            sx={{ minWidth: "100%" }}
                            id="projectSearch"
                            label="Project Search"
                            variant="standard"
                            {...register('projectSearch')}
                        />
                    </Box>
                    <FormControl variant="standard" sx={{ width: "22%" }}>
                        <InputLabel id="projectType">Project Type</InputLabel>
                        <Select
                            labelId="projectType"
                            id="projectType"
                            label="Project Type"
                            fullWidth
                            {...register('projectType')}
                        // error={!!errors.projectType}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                projectTypes.map((projectType: any) => (
                                    <MenuItem key={projectType.id} value={projectType.name}>{projectType.name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}></FormHelperText>
                    </FormControl>
                    <FormControl variant="standard" sx={{ width: "22%" }}>
                        <InputLabel id="projectStatus">Project Status</InputLabel>
                        <Select
                            labelId="projectStatus"
                            id="projectStatus"
                            label="projectStatus"
                            fullWidth
                            {...register('projectStatus')}
                            error={!!errors.projectType}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"Accepted"}>Accepted</MenuItem>
                            <MenuItem value={"Declined"}>Declined</MenuItem>
                        </Select>
                        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}></FormHelperText>
                    </FormControl>
                    <Button
                        variant="contained" sx={{ minWidth: "max-content" }}
                        type="submit">
                        Apply Filter
                    </Button>
                </form>
                <div className={styles.cardsArea}>
                    {Array.isArray(projectsResult) && projectsResult.map((project: any) => (
                        <ViewAllProjectsCard key={project.id} projectResult={project} />
                    ))}
                </div>
            </div>
        </div>
    )
}
