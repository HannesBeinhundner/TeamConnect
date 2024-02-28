"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./YourProjectCard.module.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { addEntry } from './AddProjectAction';


export default function YourProjectCard() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [sucessAlert, setSucessAlert] = useState(false)
    const handleCloseAlert = () => {
        setSucessAlert(false)
    }

    useEffect(() => {
        if (sucessAlert) {
            const timerId = setTimeout(() => {
                handleClose();
                setSucessAlert(false);  // Reset the success alert state
            }, 4000);

            // Clear the timeout in case the component is unmounted
            return () => clearTimeout(timerId);
        }
    }, [sucessAlert]);

    const [projectTypeInput, setProjectTypeInput] = useState('');

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    // const handleChange = (event: SelectChangeEvent) => {
    //     setProjectTypeInput(event.target.value);
    // };

    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreateProjectInputs>({
        resolver: zodResolver(CreateProjectSchema)
    })

    const processForm: SubmitHandler<CreateProjectInputs> = async data => {
        const result = await addEntry(data)

        if (!result) {
            alert("Something went wrong")
            return
        }

        if (result.error) {
            console.log(result.error)
            setError("projectName", {
                type: "server",
                message: result.error.toString() // TODO: FIX MESSAGE OUTPUT TO HELPERINPUT FIELD
            })

            return
        }

        console.log(result)
        setSucessAlert(true)
        reset()
        handleClose()
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Your Project</h5>
                {/* <Link href="#" className={styles.expandLink}>
                    <OpenInFullIcon fontSize="small" />
                </Link> */}
            </div>
            <div className={styles.contentArea}>
                <p>You haven’t yet created a project or joined an existing one</p>
                <div>
                    <Button variant="contained" onClick={handleClickOpen}>
                        Create Project
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        fullWidth={true}
                        maxWidth={"md"}
                        className={styles.createModal}
                        PaperProps={{
                            style: {
                                // backgroundColor: '#232323',
                                // color: 'text.secondary'
                            },
                        }}
                    >
                        <DialogTitle>Create Project</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[700],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <DialogContentText sx={{ color: '#1C1C1C' }}>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                            </DialogContentText>
                            <form onSubmit={handleSubmit(processForm)} className={styles.formContainer}>
                                <TextField
                                    //required
                                    margin="dense"
                                    id="projectName"
                                    label="Project Name*"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    {...register('projectName')}
                                    error={!!errors.projectName}
                                    helperText={errors.projectName?.message}
                                />
                                <FormControl variant="standard" sx={{ minWidth: "100%" }} error={!!errors.projectType}>
                                    <InputLabel id="projectType">Project Type *</InputLabel>
                                    <Select
                                        labelId="projectType"
                                        id="projectType"
                                        //value={projectTypeInput}
                                        //onChange={handleChange}
                                        label="Project Type"
                                        //required
                                        fullWidth
                                        {...register('projectType')}
                                        error={!!errors.projectType}
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
                                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.projectType?.message}</FormHelperText>
                                </FormControl>
                                <FormControl variant="standard" sx={{ minWidth: "100%" }} error={!!errors.projectType}>
                                    <InputLabel id="projectSupervisor">Project Supervisor *</InputLabel>
                                    <Select
                                        labelId="projectSupervisor"
                                        id="projectSupervisor"
                                        //value={projectTypeInput}
                                        //onChange={handleChange}
                                        label="project Supervisor"
                                        //required
                                        fullWidth
                                        {...register('projectSupervisor')}
                                        error={!!errors.projectSupervisor}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Melanie Daveid"}>Melanie Daveid</MenuItem>
                                        <MenuItem value={"Florian Jindra"}>Florian Jindra</MenuItem>
                                        <MenuItem value={"Brigitte Jellinek"}>Brigitte Jellinek</MenuItem>
                                    </Select>
                                    <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.projectSupervisor?.message}</FormHelperText>
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    id="projectLink"
                                    label="Project Link"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    {...register('projectLink')}
                                    error={!!errors.projectLink}
                                    helperText={errors.projectLink?.message}
                                />
                                <TextField
                                    //required
                                    margin="dense"
                                    id="projectDescription"
                                    label="Project Description *"
                                    type="text"
                                    placeholder="Specify what your project is about..."
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    {...register('projectDescription')}
                                    error={!!errors.projectDescription}
                                    helperText={errors.projectDescription?.message}
                                />
                                <TextField
                                    //required
                                    margin="dense"
                                    id="projectSkills"
                                    label="Preffered skills and study program"
                                    type="text"
                                    placeholder="Specify desired team skills and relevant student courses for your project..."
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    {...register('projectSkills')}
                                    error={!!errors.projectSkills}
                                    helperText={errors.projectSkills?.message}
                                />
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Project Logo
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload Exposé
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                                <DialogActions>
                                    <Button variant="contained" type="submit">Create</Button>
                                </DialogActions>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                {sucessAlert && (
                    <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                        {'Your Project was successfully created!'}
                    </Alert>
                )}
            </div>
        </div>
    );
}
