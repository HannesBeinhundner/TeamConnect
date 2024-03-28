"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Link from "next/link";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import CloseIcon from '@mui/icons-material/Close';
import styles from "./YourProjectCard.module.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { addEntry } from './AddProjectAction';
import { useSession } from "next-auth/react";
import { checkProject } from './CheckProjectAction';
import YourProjectInformationArea from '../YourProjectInfoArea/YourProjectInfoArea';
import ProjectUpdateDialog from '@/components/ProjectUpdateDialog/ProjectUpdateDialog';
import { getProjectTypes } from '@/app/lib/GetProjectTypesAction';

// @ts-ignore
export default function YourProjectCard({ eventId }) {
    const { data: session } = useSession();
    const sessionEmail = session?.user?.email;
    const [checkProjectResult, setCheckProjectResult] = useState(false);
    const [projectResult, setProjectResult] = useState<any>([]);
    const [projectTypes, setProjectTypes] = useState<any>([]);


    const [open, setOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false)
    const [successAlert, setSucessAlert] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        reset()
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setSucessAlert(false)
        setErrorAlert(false)
    }

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const fetchProjectStatus = async () => {
        const projectResult: any = await checkProject(sessionEmail, eventId);
        projectResult ? setCheckProjectResult(true) : setCheckProjectResult(false)
        setProjectResult(projectResult);
        console.log(projectResult)
    };

    useEffect(() => {
        const fetchProjectTypes = async () => {
            const projectTypes: any = await getProjectTypes(eventId);
            setProjectTypes(projectTypes);
        };

        fetchProjectStatus();
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        if (successAlert || errorAlert) {
            const timerId = setTimeout(() => {
                handleCloseAlert();
            }, 3000);

            return () => clearTimeout(timerId);
        }
    }, [successAlert, errorAlert]);

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
        const result = await addEntry(data, sessionEmail, eventId)

        if (!result) {
            alert("Something went wrong")
            return
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString())
            setErrorAlert(true)
            return
        }

        setSucessAlert(true)
        reset()
        handleModalClose()
        fetchProjectStatus();
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Your Project</h5>
                {checkProjectResult ? (
                    <IconButton aria-label="expand" sx={{ color: '#1C1C1C' }} onClick={handleUpdateDialogOpen}>
                        <SettingsIcon fontSize="small" />
                    </IconButton>
                ) : ''}
            </div>
            {
                checkProjectResult && projectResult && (  // Ensure projectResult is not undefined or null
                    <ProjectUpdateDialog
                        open={updateDialogOpen}
                        onClose={handleUpdateDialogClose}
                        projectResult={projectResult}
                        reloadComponent={fetchProjectStatus}
                        projectTypes={projectTypes}
                    />
                )
            }

            <div className={styles.contentArea}>
                {checkProjectResult ? (
                    <YourProjectInformationArea projectResult={projectResult} />
                ) : (
                    <div className={styles.emptyProjectArea}>
                        <p>You haven’t yet created a project or joined an existing one</p>
                        <div>
                            <Button variant="contained" onClick={handleClickOpen}>
                                Create Project
                            </Button>
                            <Dialog
                                open={open}
                                onClose={handleModalClose}
                                fullWidth={true}
                                maxWidth={"md"}
                                className={styles.createModal}
                            >
                                <DialogTitle>Create Project</DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleModalClose}
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
                                                label="Project Type"
                                                fullWidth
                                                {...register('projectType')}
                                                error={!!errors.projectType}
                                            >
                                                {
                                                    projectTypes.map((projectType: any) => (
                                                        <MenuItem key={projectType.id} value={projectType.name}>{projectType.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.projectType?.message}</FormHelperText>
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
                                            margin="dense"
                                            id="projectSkills"
                                            label="Preffered skills and expertise"
                                            type="text"
                                            placeholder="Specify desired team skills and relevant expertises for your project..."
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
                                            Upload Document
                                            <VisuallyHiddenInput type="file" />
                                        </Button>
                                        <DialogActions>
                                            <Button variant="contained" type="submit">Create</Button>
                                        </DialogActions>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            {successAlert && (
                                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                                    {'Your Project was successfully created!'}
                                </Alert>
                            )}
                            {errorAlert && (
                                <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                                    {serverErrorMessage}
                                </Alert>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
