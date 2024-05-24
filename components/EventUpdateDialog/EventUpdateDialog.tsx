"use client"

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEventSchema } from '@/app/lib/types';
import { CreateEventInputs } from '@/app/lib/types';
import styles from './EventUpdateDialog.module.scss';
import { updateEvent } from './UpdateEventAction';
import { deleteEvent } from './DeleteEventAction';
import { MuiChipsInput } from 'mui-chips-input'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EventUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    eventResult: any;
    reloadComponent: () => void;
}

const EventUpdateDialog: React.FC<EventUpdateDialogProps> = ({ open, onClose, eventResult, reloadComponent }) => {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

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
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Your Event was successfully updated!');
        onClose();
        reloadComponent();
    };

    const handleDeleteEvent = async () => {
        const result = await deleteEvent(eventResult?.id);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success('Your Event was successfully deleted!');
        onClose();
        reloadComponent()
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    return (
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
    );
};

export default EventUpdateDialog;
