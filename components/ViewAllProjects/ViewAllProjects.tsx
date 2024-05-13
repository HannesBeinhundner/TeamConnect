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
import { ApplyFilterInputs, ApplyFilterSchema } from '@/app/lib/types'
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ApplyFilter } from './ApplyFilterAction';
import ViewAllProjectsCard from '../ViewAllProjectsCard/ViewAllProjectsCard';
import { getProjectTypes } from '@/app/lib/GetProjectTypesAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ViewAllProjects({ eventData, session }: { eventData: any, session: any }) {
    const [isLoading, setIsLoading] = useState(true);
    const [projectsResult, setProjectsResult] = useState<any>({});
    const [projectTypes, setProjectTypes] = useState<any>([]);

    const fetchProjects = async () => {
        try {
            const data = {
                projectSearch: "",
                projectType: "",
            };
            const response = await ApplyFilter(data, eventData.id);

            if (response.success && Array.isArray(response.data)) {
                setProjectsResult(response.data);
                setIsLoading(false)
            } else {
                console.error('Error: ApplyFilter did not return a successful response or data is not an array.');
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    useEffect(() => {
        const fetchProjectTypes = async () => {
            const projectTypes: any = await getProjectTypes(eventData.id);
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
            const filteredProjects = await ApplyFilter(data, eventData.id);

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
            toast.error('Unexpected error occurred!');
        }
    };

    function LoadingBox({ children }: any) {
        return (
            <div
                style={{
                    display: 'block',
                    lineHeight: 0,
                }}
                className={styles.skeletonContainer}
            >
                {children}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>View All Projects</h5>
            </div>
            <div className={styles.contentArea}>
                <form onSubmit={handleSubmit(processForm)} className={styles.filterArea}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.nameInput}>
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
                    <FormControl variant="standard" className={styles.projectTypeInput}>
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
                    <Button
                        variant="contained" sx={{ minWidth: "max-content" }}
                        type="submit">
                        Apply Filter
                    </Button>
                </form>
                <div className={styles.cardsArea}>
                    {
                        isLoading ? <Skeleton wrapper={LoadingBox} height={40} count={4} width={"100%"} /> : (
                            Array.isArray(projectsResult) && projectsResult.map((project: any) => (
                                <ViewAllProjectsCard session={session} eventData={eventData} key={project.id} projectResult={project} reloadComponent={fetchProjects} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}
