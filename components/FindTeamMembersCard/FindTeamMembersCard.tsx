"use client"

import React, { useState, useEffect } from 'react';
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
import { inviteUserToProject } from './InviteUserToProjectAction';
import { getCurrentUserData } from './getUserAction';
import { getInviteData } from './getInviteAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

//@ts-ignore
export default function FindTeamMembersCard({ userResult, session, eventData, reloadComponent, reloadParentComponent }) {
    const [isLoading, setIsLoading] = useState(true);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>(null);
    const [invitationData, setInvitationData] = useState<any>(null);

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
        const result = await inviteUserToProject(eventData, session.user.email, userResult.email);

        if (result.success) {
            toast.success('Invitation sent successfully!');
        } else {
            toast.error('Failed to send invitation: ' + result.error);
        }
        handleInviteDialogClose();
        reloadParentComponent();
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
        const invitationData: any = await getInviteData(userResult.email, currentUserData.projectId);
        setInvitationData(invitationData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    function LoadingBox({ children }: any) {
        return (
            <div
                style={{
                    display: 'block',
                    lineHeight: 0,
                }}
                className={styles.skeletonContainer}
            >
                {children}
            </div>
        );
    }

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
                    {
                        userResult?.expertise && (<Chip className={styles.chipColor} text={userResult?.expertise} icon={<BadgeIcon fontSize='small' />} />)
                    }
                    <Link href={`mailto:${userResult?.email}`} className={styles.chipLink} target="_blank">
                        <Chip className={styles.chipColor} text={userResult?.email} icon={<EmailIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                    </Link>
                </div>
            </div>
            <div className={styles.descriptionArea}>
                <p>{userResult?.description}</p>
                <div className={styles.buttonWrapper}>
                    {

                        isLoading ? <Skeleton wrapper={LoadingBox} height={37} count={1} width={"100%"} /> : (
                            <>
                                {eventData.adminEmail === session.user.email && (
                                    <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                        Remove User
                                    </Button>
                                )}
                                {currentUserData?.projectAdmin && !userResult?.projectId && !invitationData && (
                                    <Button variant="contained" onClick={handleInviteButtonClick}>
                                        Invite to Join
                                    </Button>
                                )}
                                {currentUserData?.projectAdmin && !userResult?.projectId && invitationData && (
                                    <Button variant="contained" disabled>
                                        Invitation pending
                                    </Button>
                                )}
                                {currentUserData?.projectAdmin && (userResult?.projectId === currentUserData?.projectId) && (
                                    <Button variant="contained" disabled>
                                        Already in your project
                                    </Button>
                                )}
                                {currentUserData?.projectAdmin && userResult?.projectId !== null && (userResult?.projectId !== currentUserData?.projectId) && (
                                    <Button variant="contained" disabled>
                                        Already in a project
                                    </Button>
                                )}
                            </>
                        )
                    }

                    <Dialog
                        open={confirmationDialogOpen}
                        onClose={handleConfirmationDialogClose}
                    >
                        <DialogTitle>Confirm Remove User</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to remove <strong>{userResult?.name}</strong>?
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
                                Are you sure you want to invite <strong>{userResult?.name}</strong> to join your project?
                            </DialogContentText>
                            <DialogContentText>
                                An invitation email will be sent to <strong>{userResult?.email}</strong>.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleInviteDialogClose}>Cancel</Button>
                            <Button onClick={handleInviteUser} color="success">Invite</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>

            <FindTeamMembersViewDialog
                handleInviteUser={handleInviteUser}
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
