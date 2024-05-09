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
import styles from './FindTeamMembersViewDialog.module.scss';
import Image from 'next/image';
import Chip from '@/components/Chip/Chip';
import Link from "next/link";
import { removeUser } from '@/components/FindTeamMembersCard/RemoveUserAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    eventData: any;
    userResult: any;
    reloadComponent: any
}

const FindTeamMembersViewDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, userResult, session, eventData, reloadComponent }) => {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const handleRemoveUser = async () => {
        const result = await removeUser(userResult?.id);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.success('This user could not be removed!');
            return;
        }

        toast.success('This user was successfully removed!');
        reloadComponent();
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };


    return (
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
                            Are you sure you want to remove {userResult?.name}?
                            {userResult?.projectAdmin && <strong> This user is a project admin and the project will be deleted!</strong>}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                        <Button onClick={handleRemoveUser} color="error">Remove</Button>
                    </DialogActions>
                </Dialog>
            </DialogActions>
        </Dialog>
    );
};

export default FindTeamMembersViewDialog;
