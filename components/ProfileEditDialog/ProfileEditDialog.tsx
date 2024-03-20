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
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema } from '@/app/lib/types';
import { UpdateProfileInputs } from '@/app/lib/types';
import styles from './ProfileEditDialog.module.scss';
import { updateProfile } from './UpdateProfileAction';
import { getProfile } from '../OptionsArea/GetProfileAction';
import { studyProgramTypes } from '@/app/lib/data'

interface ProfileUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    profileResult: any;
}

const ProfileEditDialog: React.FC<ProfileUpdateDialogProps> = ({ open, onClose, session, profileResult }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [serverErrorMessage, setServerErrorMessage] = useState('');


    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
    };

    console.log(profileResult?.name)

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
    } = useForm<UpdateProfileInputs>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            //profileName: profileResult?.name || 'test', // Somehow doesnt work this way
            //profileExpertise: profileResult?.major || 'test',
            //profileDescription: profileResult?.description || 'test',
        },
    });

    const handleUpdate: SubmitHandler<UpdateProfileInputs> = async (data: any) => {
        const result = await updateProfile(data, session.user.email);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }

        setSuccessMessage('Your Profile was successfully updated!')
        setSuccessAlert(true);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className={styles.updateModal}>
                <DialogTitle>Edit Profile</DialogTitle>
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
                            id="profileName"
                            label="Profile Name*"
                            type="text"
                            defaultValue={profileResult?.name}
                            fullWidth
                            variant="standard"
                            {...register('profileName')}
                            error={!!errors.profileName}
                            helperText={errors.profileName?.message}
                        />
                        <FormControl variant="standard" sx={{ minWidth: '100%' }} error={!!errors.profileExpertise}>
                            <InputLabel id="profileExpertise">Profile Expertise *</InputLabel>
                            <Select
                                labelId="profileExpertise"
                                id="profileExpertise"
                                label="Profile Expertise"
                                fullWidth
                                defaultValue={profileResult?.major}
                                {...register('profileExpertise')}
                                error={!!errors.profileExpertise}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={studyProgramTypes.web}>{studyProgramTypes.web}</MenuItem>
                                <MenuItem value={studyProgramTypes.game}>{studyProgramTypes.game}</MenuItem>
                                <MenuItem value={studyProgramTypes.film}>{studyProgramTypes.film}</MenuItem>
                                <MenuItem value={studyProgramTypes.audio}>{studyProgramTypes.audio}</MenuItem>
                                <MenuItem value={studyProgramTypes.computeranimation}>{studyProgramTypes.computeranimation}</MenuItem>
                                <MenuItem value={studyProgramTypes.communicationdesign}>{studyProgramTypes.communicationdesign}</MenuItem>
                            </Select>
                            <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.profileExpertise?.message}</FormHelperText>
                        </FormControl>
                        {/* <FormControl variant="standard" sx={{ minWidth: '100%' }} error={!!errors.projectSupervisor}>
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
                                {projectSupervisors && projectSupervisors.map((supervisor: any) => (
                                    <MenuItem key={supervisor.id} value={supervisor.name}>
                                        {supervisor.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.profileExpertise?.message}</FormHelperText>
                        </FormControl> */}
                        <TextField
                            margin="dense"
                            id="profileDescription"
                            label="Profile Description *"
                            type="text"
                            placeholder="Specify your skills and interests.."
                            defaultValue={profileResult?.description}
                            fullWidth
                            multiline
                            maxRows={4}
                            {...register('profileDescription')}
                            error={!!errors.profileDescription}
                            helperText={errors.profileDescription?.message}
                        />
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

export default ProfileEditDialog;