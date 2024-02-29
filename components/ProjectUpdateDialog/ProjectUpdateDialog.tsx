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

interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    projectResult: any;
    reload: () => void;
}

const ProjectUpdateDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, reload }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');

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
            projectSupervisor: projectResult?.supervisor || '',
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

        setSuccessAlert(true);
        onClose();
        reload();
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
                    <DialogContentText sx={{ color: '#1C1C1C' }}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </DialogContentText>
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="Web-project">Web-project</MenuItem>
                                <MenuItem value="Game-project">Game-project</MenuItem>
                                <MenuItem value="Film-project">Film-project</MenuItem>
                                <MenuItem value="Audio-project">Audio-project</MenuItem>
                                <MenuItem value="Computeranimation-project">Computeranimation-Project</MenuItem>
                                <MenuItem value="Multimedia-project">Multimedia-project</MenuItem>
                                <MenuItem value="other">other</MenuItem>
                            </Select>
                            <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.projectType?.message}</FormHelperText>
                        </FormControl>
                        <FormControl variant="standard" sx={{ minWidth: '100%' }} error={!!errors.projectSupervisor}>
                            <InputLabel id="projectSupervisor">Project Supervisor *</InputLabel>
                            <Select
                                labelId="projectSupervisor"
                                id="projectSupervisor"
                                label="Project Supervisor"
                                fullWidth
                                defaultValue={projectResult?.supervisor}
                                {...register('projectSupervisor')}
                                error={!!errors.projectSupervisor}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="Melanie Daveid">Melanie Daveid</MenuItem>
                                <MenuItem value="Florian Jindra">Florian Jindra</MenuItem>
                                <MenuItem value="Brigitte Jellinek">Brigitte Jellinek</MenuItem>
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
                            label="Preferred skills and study program"
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
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            {successAlert && (
                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                    {'Your Project was successfully updated!'}
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
