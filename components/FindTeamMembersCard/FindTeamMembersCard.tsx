"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import LinkIcon from '@mui/icons-material/Link';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./FindTeamMembersCard.module.scss";
import Link from "next/link";
import ProfilePicture from '@/images/profile_girl.png'
import { Button, IconButton } from '@mui/material';
import { getProjectUsers } from '../ViewAllProjectsCard/GetProjectUsersAction';
import FindTeamMembersViewDialog from '@/components/FindTeamMembersViewDialog/FindTeamMembersViewDialog';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { removeUser } from './RemoveUserAction';

//@ts-ignore
export default function FindTeamMembersCard({ userResult, session, eventData, reloadComponent }) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

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

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
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
                    <Chip className={styles.chipColor} text={userResult?.expertise} icon={<SchoolIcon fontSize='small' />} />
                    <Link href={`mailto:${userResult?.email}`} className={styles.chipLink} target="_blank">
                        <Chip className={styles.chipColor} text={userResult?.email} icon={<EmailIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                    </Link>
                </div>
            </div>
            <div className={styles.descriptionArea}>
                <p>{userResult?.description}</p>
                <div className={styles.buttonWrapper}>
                    {/* <Button variant="contained">
                        Contact
                    </Button> */}
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
                                Are you sure you want to remove this User?
                                {userResult?.projectAdmin && <strong> This user is a project admin and the project will be deleted!</strong>}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                            <Button onClick={handleRemoveUser} color="error">Remove</Button>
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
                </div>
            </div>

            <FindTeamMembersViewDialog
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                eventData={eventData}
                userResult={userResult}
                reloadComponent={reloadComponent}
            />
        </div>
    );
};
