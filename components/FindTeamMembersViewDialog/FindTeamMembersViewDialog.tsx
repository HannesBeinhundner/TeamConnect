"use client"
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import styles from './FindTeamMembersViewDialog.module.scss';
import Image from 'next/image';
import Chip from '@/components/Chip/Chip';
import Link from "next/link";
import { removeUser } from '@/components/FindTeamMembersCard/RemoveUserAction';


interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    eventData: any;
    userResult: any;
    reloadComponent: any
}

const FindTeamMembersViewDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, userResult, session, eventData, reloadComponent }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [projectUsers, setProjectUsers] = useState<any>([]);

    const handleRemoveUser = async () => {
        const result = await removeUser(userResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setErrorAlert(true);
            return;
        }
        setSuccessAlert(true);
        setTimeout(() => reloadComponent(), 1500)
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

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
        console.log(userResult);
    }, [successAlert, errorAlert]);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>User</DialogTitle>
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
                <DialogContent className={styles.viewDialog}>
                    <div className={styles.titleArea}>
                        <Image
                            className={styles.profile}
                            src={userResult.image}
                            alt="Profile picture of user"
                            width={50}
                            height={50}
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                        <h1>{userResult?.name}</h1>
                    </div>
                    <div className={styles.propertyArea}>
                        <Chip className={styles.chipColor} text={userResult?.expertise} icon={<SchoolIcon fontSize='small' />} />
                        <Link href={`mailto:${userResult?.email}`} className={styles.chipLink} target="_blank">
                            <Chip className={styles.chipColor} text={userResult?.email} icon={<EmailIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                        </Link>
                    </div>
                    <DialogContentText sx={{ color: '#1C1C1C' }}>
                        {userResult.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {
                        // Show remove button only if the user is an event admin
                        eventData.adminEmail === session.user.email && (
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Remove User
                            </Button>
                        )
                    }
                    <Button variant="contained" type="submit">
                        Invite to Join
                    </Button>
                    <Dialog
                        open={confirmationDialogOpen}
                        onClose={handleConfirmationDialogClose}
                    >
                        <DialogTitle>Confirm Remove User</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to remove this User? If the user is a project admin, the project will be deleted.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                            <Button onClick={handleRemoveUser} color="error">Remove</Button>
                        </DialogActions>
                    </Dialog>
                </DialogActions>
            </Dialog>
            {successAlert && (
                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                    This User was successfully removed!
                </Alert>
            )}
            {errorAlert && (
                <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                    This User couldn't be removed!
                </Alert>
            )}
        </>
    );
};

export default FindTeamMembersViewDialog;
