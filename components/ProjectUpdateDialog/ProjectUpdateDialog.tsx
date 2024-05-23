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
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    projectResult: any;
    reloadComponent: () => void;
    reloadParentComponent: () => void;
    projectTypes: any;
    sessionEmail: any;
}

const ProjectUpdateDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, reloadComponent, reloadParentComponent, projectTypes, sessionEmail }) => {
    const [user, setUser] = useState<any>(null);
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [imageName, setImageName] = useState('');

    const isProjectAdmin = user && (user.projectId === projectResult?.id) && user.projectAdmin
    const isNotProjectAdmin = user && (user.projectId === projectResult?.id) && !user.projectAdmin


    useEffect(() => {
        const getCurrentUser = async (sessionEmail: string) => {
            const result = await getUser(sessionEmail);
            setUser(result);
        }

        getCurrentUser(sessionEmail);
    }, [])

    const {
        register,
        handleSubmit,
        setValue,
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
            projectImage: projectResult?.image || '',
            projectFile: projectResult?.file || '',
        },
    });

    const handleUpdate: SubmitHandler<UpdateProjectInputs> = async (data: any) => {
        const result = await updateProject(data, projectResult?.id);

        if (!result) {
            toast.error("Something went wrong!");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            toast.error(serverErrorMessage);
            return;
        }

        toast.success('Your Project was successfully updated!');
        onClose();
        reloadComponent();
        reloadParentComponent();
    };

    const handleDeleteProject = async () => {
        const result = await deleteProject(projectResult?.id);

        if (!result) {
            toast.error("Something went wrong!");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            toast.error('You could not delete the Project!');
            return;
        }

        toast.success('Your Project was successfully deleted!');
        onClose();
        reloadComponent();
        reloadParentComponent();
    };

    const handleLeaveProject = async () => {
        const result = await leaveProject(projectResult?.id, user?.id);

        if (!result) {
            toast.error("Something went wrong!");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            toast.error('You could not leave the Project!');
            return;
        }

        toast.success('You successfully left the Project!');
        onClose();
        reloadComponent();
        reloadParentComponent();
    };

    const handleActionButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
                    <div>
                        <UploadButton
                            appearance={{
                                button: {
                                    width: "100%",
                                    maxWidth: "200px",
                                    backgroundColor: "#1976d2"
                                }
                            }}
                            content={{
                                button: "Upload Project Logo",
                            }}
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                setImageName(res[0].name);
                                setValue('projectImage', res[0].url);
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Unexpected error occurred!`);
                            }}
                        />
                        <p className={styles.fileName}>{imageName}</p>
                    </div>

                    <div>
                        <UploadButton
                            appearance={{
                                button: {
                                    width: "100%",
                                    maxWidth: "200px",
                                    backgroundColor: "#1976d2"
                                }
                            }}
                            content={{
                                button: "Upload PDF File",
                            }}
                            endpoint="textUploader"
                            onClientUploadComplete={(res) => {
                                // Set the projectImage value to the uploaded image URL
                                setDocumentName(res[0].name);
                                setValue('projectFile', res[0].url);
                                //setValue('projectFileName', res[0].name);
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Unexpected error occurred!`);
                            }}
                        />
                        <p className={styles.fileName}>{documentName}</p>
                    </div>

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
                                        isProjectAdmin && ('Are you sure you want to delete the entire project?')
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
        </Dialog >
    );
};

export default ProjectUpdateDialog;
