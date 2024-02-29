"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import styles from "./ViewAllProjects.module.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplyFilterInputs, ApplyFilterSchema, CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
//import { checkProject } from './CheckProjectAction';
import { signIn, signOut, useSession } from "next-auth/react";
import { Box, Input, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ApplyFilter } from './ApplyFilterAction';

export default function ViewAllProjects() {

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
        const result = await ApplyFilter(data)

        if (!result) {
            alert("Something went wrong")
            return
        }

        reset()
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>View All Projects</h5>
            </div>
            <div className={styles.contentArea}>
                <form onSubmit={handleSubmit(processForm)} className={styles.filterArea}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <SearchIcon 
                            sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                        />
                        <TextField
                            sx={{ minWidth: "100%" }}
                            id="projectSearch" 
                            label="projectSearch" 
                            variant="standard" 
                            {...register('projectSearch')}
                        />
                    </Box>
                    <FormControl variant="standard" sx={{ minWidth: "15%", maxWidth: "70%" }}>
                        <InputLabel id="projectType">Project Type *</InputLabel>
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
                            <MenuItem value={"Web-project"}>Web-project</MenuItem>
                            <MenuItem value={"Game-project"}>Game-project</MenuItem>
                            <MenuItem value={"Film-project"}>Film-project</MenuItem>
                            <MenuItem value={"Audio-project"}>Audio-project</MenuItem>
                            <MenuItem value={"Computeranimation-project"}>Computeranimation-Project</MenuItem>
                            <MenuItem value={"Multimedia-project"}> Multimedia-project</MenuItem>
                            <MenuItem value={"other"}>other</MenuItem>
                        </Select>
                        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}></FormHelperText>
                    </FormControl>
                    <FormControl variant="standard" sx={{ minWidth: "15%", maxWidth: "70%" }}>
                        <InputLabel id="projectStatus">Project Status *</InputLabel>
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
                        variant="contained" 
                        type="submit">
                        Apply Filter
                    </Button>
                </form>          
                </div>
            </div>
    )
}
