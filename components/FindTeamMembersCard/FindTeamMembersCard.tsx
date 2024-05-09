"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./FindTeamMembersCard.module.scss";
import Link from "next/link";
import { Button, IconButton } from '@mui/material';
import FindTeamMembersViewDialog from '@/components/FindTeamMembersViewDialog/FindTeamMembersViewDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { removeUser } from './RemoveUserAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//@ts-ignore
export default function FindTeamMembersCard({ userResult, session, eventData, reloadComponent }) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const handleRemoveUser = async () => {
        const result = await removeUser(userResult?.id);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.error('This user could not be removed!')
            return;
        }
        toast.success('This user was successfully removed!')
        handleUpdateDialogClose();
        reloadComponent();
    };

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.topArea}>
                <div className={styles.headArea}>
                    <div className={styles.titleArea}>
                        <Link href="#" className={styles.profile}>
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
                        </Link>
                        <h2>{userResult?.name}</h2>
                    </div>
                    <IconButton aria-label="expand" sx={{ color: '#1C1C1C' }} onClick={handleUpdateDialogOpen}>
                        <OpenInFullIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className={styles.propertyArea}>
                    <Chip className={styles.chipColor} text={userResult?.expertise} icon={<BadgeIcon fontSize='small' />} />
                    <Link href={`mailto:${userResult?.email}`} className={styles.chipLink} target="_blank">
                        <Chip className={styles.chipColor} text={userResult?.email} icon={<EmailIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                    </Link>
                </div>
            </div>
            <div className={styles.descriptionArea}>
                <p>{userResult?.description}</p>
                <div className={styles.buttonWrapper}>
                    {
                        // Show remove button only if the user is an event admin
                        eventData.adminEmail === session.user.email && (
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Remove User
                            </Button>
                        )
                    }
                    <Button variant="contained">
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
                </div>
            </div>

            <FindTeamMembersViewDialog
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                eventData={eventData}
                userResult={userResult}
                reloadComponent={reloadComponent}
                handleDeleteButtonClick={handleDeleteButtonClick}
            />
        </div>
    );
};
