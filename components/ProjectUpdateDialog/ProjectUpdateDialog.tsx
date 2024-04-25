"use client"
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProjectSchema } from '@/app/lib/types';
import { UpdateProjectInputs } from '@/app/lib/types';
import styles from './ProjectUpdateDialog.module.scss';
import { updateProject } from './UpdateProjectAction';
import { deleteProject } from './DeleteProjectAction';
import { getUser } from './GetUserAction';
import { leaveProject } from './LeaveProjectAction';

interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    projectResult: any;
    reloadComponent: () => void;
    projectTypes: any;
    sessionEmail: any;
}

const ProjectUpdateDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, reloadComponent, projectTypes, sessionEmail }) => {
    const [user, setUser] = useState<any>(null);
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const isProjectAdmin = user && (user.projectId === projectResult?.id) && user.projectAdmin
    const isNotProjectAdmin = user && (user.projectId === projectResult?.id) && !user.projectAdmin


    useEffect(() => {
        const getCurrentUser = async (sessionEmail: string) => {
            const result = await getUser(sessionEmail);
            setUser(result);
        }

        getCurrentUser(sessionEmail);
    }, [])

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

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
    };

    useEffect(() => {
        if (successAlert || errorAlert) {
            const timerId = setTimeout(() => {
                handleCloseAlert();
            }, 3000);

            return () => clearTimeout(timerId);
        }
    }, [successAlert, errorAlert]);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<UpdateProjectInputs>({
        resolver: zodResolver(UpdateProjectSchema),
        defaultValues: {
            projectName: projectResult?.name || '',
            projectType: projectResult?.type || '',
            projectLink: projectResult?.link || '',
            projectDescription: projectResult?.description || '',
            projectSkills: projectResult?.skills || '',
        },
    });

    const handleUpdate: SubmitHandler<UpdateProjectInputs> = async (data: any) => {
        const result = await updateProject(data, projectResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }

        setSuccessMessage('Your Project was successfully updated!')
        setSuccessAlert(true);
        onClose();
        reloadComponent();
    };

    const handleDeleteProject = async () => {
        const result = await deleteProject(projectResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }
        setSuccessMessage('Your Project was successfully deleted!')
        setSuccessAlert(true);
        onClose();
        setTimeout(() => reloadComponent(), 1500)
    };

    const handleLeaveProject = async () => {
        const result = await leaveProject(projectResult?.id, user?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }
        setSuccessMessage('You successfully left the Project!')
        setSuccessAlert(true);
        onClose();
        setTimeout(() => reloadComponent(), 1500)
    };

    const handleActionButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className={styles.updateModal}>
                <DialogTitle>Update Project</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
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
                    <form onSubmit={handleSubmit(handleUpdate)} className={styles.formContainer}>
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
                        <FormControl variant="standard" sx={{ minWidth: '100%' }} error={!!errors.projectType}>
                            <InputLabel id="projectType">Project Type *</InputLabel>
                            <Select
                                labelId="projectType"
                                id="projectType"
                                label="Project Type"
                                fullWidth
                                defaultValue={projectResult?.type}
                                {...register('projectType')}
                                error={!!errors.projectType}
                            >
                                {
                                    projectTypes && projectTypes.map((projectType: any) => (
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
                            label="Preferred skills and expertise"
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
                            {
                                // Show remove button only if the user is the project admin
                                isProjectAdmin && (
                                    <Button variant="contained" color="error" onClick={handleActionButtonClick}>
                                        Delete Project
                                    </Button>
                                )
                            }
                            {
                                // Show leave button only if the user is not the project admin
                                isNotProjectAdmin && (
                                    <Button variant="contained" color="error" onClick={handleActionButtonClick}>
                                        Leave Project
                                    </Button>
                                )
                            }
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Dialog
                                open={confirmationDialogOpen}
                                onClose={handleConfirmationDialogClose}
                            >
                                <DialogTitle>
                                    {
                                        isProjectAdmin && ('Confirm Deletion')
                                    }
                                    {
                                        isNotProjectAdmin && ('Confirm Leave')
                                    }
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {
                                            isProjectAdmin && ('Are you sure you want to delete this project?')
                                        }
                                        {
                                            isNotProjectAdmin && ('Are you sure you want to leave this project?')
                                        }
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                                    {
                                        isProjectAdmin && (<Button onClick={handleDeleteProject} color="error">Delete</Button>)
                                    }
                                    {
                                        isNotProjectAdmin && (<Button onClick={handleLeaveProject} color="error">Leave</Button>)
                                    }
                                </DialogActions>
                            </Dialog>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            {successAlert && (
                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                    {successMessage}
                </Alert>
            )}
            {errorAlert && (
                <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                    {serverErrorMessage}
                </Alert>
            )}
        </>
    );
};

export default ProjectUpdateDialog;
