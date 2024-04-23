"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEventSchema } from '@/app/lib/types';
import { CreateEventInputs } from '@/app/lib/types';
import styles from './EventUpdateDialog.module.scss';
import { updateEvent } from './UpdateEventAction';
import { deleteEvent } from './DeleteEventAction';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MuiChipsInput } from 'mui-chips-input'

interface EventUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    eventResult: any;
    reloadComponent: () => void;
}

const EventUpdateDialog: React.FC<EventUpdateDialogProps> = ({ open, onClose, eventResult, reloadComponent }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

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
        control,
        reset,
        formState: { errors },
    } = useForm<CreateEventInputs>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            // Somehow doesnt work this way to set all the other default values here
            eventProjectType: eventResult?.EventProjectType.map((item: any) => item.name) || [],
            eventExpertise: eventResult?.EventExpertise.map((item: any) => item.name) || [],
        },
    });

    const handleUpdate: SubmitHandler<CreateEventInputs> = async (data: any) => {
        const result = await updateEvent(data, eventResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }

        setSuccessMessage('Your Event was successfully updated!')
        setSuccessAlert(true);
        onClose();
        reloadComponent();
    };

    const handleDeleteEvent = async () => {
        const result = await deleteEvent(eventResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString());
            setErrorAlert(true);
            return;
        }
        setSuccessMessage('Your Event was successfully deleted!')
        setSuccessAlert(true);
        onClose();
        setTimeout(() => reloadComponent(), 1500)
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className={styles.updateModal}>
                <DialogTitle>Update Event</DialogTitle>
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
                            id="eventName"
                            label="Event Name*"
                            type="text"
                            defaultValue={eventResult?.name}
                            fullWidth
                            variant="standard"
                            {...register('eventName')}
                            error={!!errors.eventName}
                            helperText={errors.eventName?.message}
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox {...register('isPartOfEvent')} defaultChecked={eventResult?.isPartOfEvent} />} label="As Admin, I want to be part of the event" />
                        </FormGroup>

                        <Controller
                            control={control}
                            render={({ field, fieldState }) => (
                                <MuiChipsInput {...field} error={fieldState.invalid} helperText={fieldState.error?.message} label="Project Types" />
                            )}
                            name="eventProjectType"
                        />

                        <Controller
                            control={control}
                            render={({ field, fieldState }) => (
                                <MuiChipsInput {...field} error={fieldState.invalid} helperText={fieldState.error?.message} label="User Expertises" />
                            )}
                            name="eventExpertise"
                        />

                        <DialogActions>
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Delete Event
                            </Button>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Dialog
                                open={confirmationDialogOpen}
                                onClose={handleConfirmationDialogClose}
                            >
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to delete this event and all it's projects?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                                    <Button onClick={handleDeleteEvent} color="error">Delete</Button>
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

export default EventUpdateDialog;
