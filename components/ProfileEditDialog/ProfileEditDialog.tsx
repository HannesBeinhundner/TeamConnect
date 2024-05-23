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
import { UpdateProfileSchema } from '@/app/lib/types';
import { UpdateProfileInputs } from '@/app/lib/types';
import styles from './ProfileEditDialog.module.scss';
import { updateProfile } from './UpdateProfileAction';
import { getExpertises } from '@/app/lib/GetExpertisesAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    profileResult: any;
    eventData: any;
    reloadComponent: any;
}

const ProfileEditDialog: React.FC<ProfileUpdateDialogProps> = ({ open, onClose, session, profileResult, eventData, reloadComponent }) => {
    const [expertises, setExpertises] = useState([]);

    useEffect(() => {
        const fetchExpertises = async () => {
            const expertises: any = await getExpertises(eventData?.id);
            setExpertises(expertises);
        };

        fetchExpertises();
    }, [])

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
            //profileExpertise: profileResult?.expertise || 'test',
            //profileDescription: profileResult?.description || 'test',
        },
    });

    const handleUpdate: SubmitHandler<UpdateProfileInputs> = async (data: any) => {
        const result = await updateProfile(data, session.user.email);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.success(result.error.toString());
            return;
        }

        toast.success('Your Profile was successfully updated!');
        onClose();
        reloadComponent();
    };

    return (
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
                <DialogContentText>
                    <strong>Please make sure that you have selected a profile expertise and a description!</strong>
                </DialogContentText>
                <br />
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
                            defaultValue={profileResult?.expertise}
                            {...register('profileExpertise')}
                            error={!!errors.profileExpertise}
                        >
                            {
                                expertises.map((expertise: any) => (
                                    <MenuItem key={expertise.id} value={expertise.name}>{expertise.name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.profileExpertise?.message}</FormHelperText>
                    </FormControl>
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
    );
};

export default ProfileEditDialog;