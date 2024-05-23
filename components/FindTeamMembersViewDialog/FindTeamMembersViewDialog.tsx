"use client"
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import styles from './FindTeamMembersViewDialog.module.scss';
import Image from 'next/image';
import Chip from '@/components/Chip/Chip';
import Link from "next/link";
import 'react-toastify/dist/ReactToastify.css';

interface ProjectUpdateDialogProps {
    handleInviteUser: any;
    invitationData: any;
    open: boolean;
    onClose: () => void;
    session: any;
    eventData: any;
    userResult: any;
    reloadComponent: any;
    handleDeleteButtonClick: any;
    currentUser: any;
}

const FindTeamMembersViewDialog: React.FC<ProjectUpdateDialogProps> = ({ handleInviteUser, invitationData, open, onClose, userResult, session, eventData, reloadComponent, handleDeleteButtonClick, currentUser }) => {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const handleInviteButtonClick = () => {
        setInviteDialogOpen(true);
    };

    const handleInviteDialogClose = () => {
        setInviteDialogOpen(false);
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
                    <h1 className={styles.userName}>{userResult?.name}</h1>
                </div>
                <div className={styles.propertyArea}>
                    {
                        userResult?.expertise && (<Chip className={styles.chipColor} text={userResult?.expertise} icon={<BadgeIcon fontSize='small' />} />)
                    }
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
                <div>
                    {currentUser?.projectAdmin && !userResult?.projectId && !invitationData && (
                        <Button variant="contained" onClick={handleInviteButtonClick}>
                            Invite to Join
                        </Button>
                    )}
                    {currentUser?.projectAdmin && !userResult?.projectId && invitationData && (
                        <Button variant="contained" disabled>
                            Invitation pending
                        </Button>
                    )}
                    {currentUser?.projectAdmin && (userResult?.projectId === currentUser?.projectId) && (
                        <Button variant="contained" disabled>
                            Already in your project
                        </Button>
                    )}
                    {currentUser?.projectAdmin && userResult?.projectId !== null && (userResult?.projectId !== currentUser?.projectId) && (
                        <Button variant="contained" disabled>
                            Already in a project
                        </Button>
                    )}
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
            </DialogActions>
        </Dialog>
    );
};

export default FindTeamMembersViewDialog;
