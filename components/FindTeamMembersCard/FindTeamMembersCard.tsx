"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import SchoolIcon from '@mui/icons-material/School';
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
import { inviteUserToProject } from './InviteUserToProjectAction';
import { getCurrentUserData } from './getUserAction';
import { getInviteData } from './getInviteAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//@ts-ignore
export default function FindTeamMembersCard({ userResult, session, eventData, reloadComponent }) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [invitationData, setInvitationData] = useState<any>([]);

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

    const handleInviteUser = async () => {
        console.log(userResult?.email);
        const result = await inviteUserToProject(eventData.id, session.user.email, userResult.email, userResult.projectId);

        if (result.success) {
            toast.success('Invitation sent successfully!');
        } else {
            toast.error('Failed to send invitation: ' + result.error);
        }
        handleInviteDialogClose();
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

    const handleInviteButtonClick = () => {
        setInviteDialogOpen(true);
    };

    const handleInviteDialogClose = () => {
        setInviteDialogOpen(false);
    };

    const fetchUserData = async () => {
        const currentUserData: any = await getCurrentUserData(session.user.email);
        setCurrentUserData(currentUserData);
    };

    const fetchInvitationData = async () => {
        const invitionData: any = await getInviteData(userResult.email, currentUserData.projectId);
        setInvitationData(invitionData);
    };

    useEffect(() => {
        fetchUserData();
        fetchInvitationData();
    }, []);

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
                    {
                        eventData.adminEmail === session.user.email && (
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Remove User
                            </Button>
                        )
                    }
                    
                    <div>
                    <div>
                        {currentUserData?.projectAdmin && !userResult?.projectId && !invitationData && (
                            <Button variant="contained" onClick={handleInviteButtonClick}>
                            Invite to Join
                            </Button>
                        )}
                        {currentUserData?.projectAdmin && !userResult?.projectId && invitationData && (
                            <Button variant="contained" onClick={handleInviteButtonClick} disabled>
                            Invitation pending
                            </Button>
                        )}
                        {currentUserData?.projectAdmin && userResult?.projectId && (
                            <Button variant="contained" onClick={handleInviteButtonClick} disabled>
                            Already in project
                            </Button>
                        )}
                    </div>
                    </div>
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

                    <Dialog
                        open={inviteDialogOpen}
                        onClose={handleInviteDialogClose}
                    >
                        <DialogTitle>Confirm Invitation</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to invite {userResult?.name} to join your project?
                            </DialogContentText>
                            <DialogContentText>
                                An invitation email will be sent to {userResult?.email}.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleInviteDialogClose}>Cancel</Button>
                            <Button onClick={handleInviteUser} color="primary">Invite</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>

            <FindTeamMembersViewDialog
                invite={handleInviteUser}
                invitationData={invitationData}
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                eventData={eventData}
                userResult={userResult}
                reloadComponent={reloadComponent}
                handleDeleteButtonClick={handleDeleteButtonClick}
                currentUser={currentUserData}
            />
        </div>
    );
};
