"use client"

import { useState } from "react";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg';
import styles from "./TopArea.module.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import IconButton from '@mui/material/IconButton';
import { leaveEvent } from "./LeaveEventAction";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import { signOut } from "next-auth/react";

export default function TopArea({ session, eventData }: { session: any, eventData: any }) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const handleLeaveButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const handleEventLeave = async () => {
        await leaveEvent(session.user.email, eventData.id);
        // end the session
        signOut();
    }

    return (
        <div className={styles.container}>
            <a href="/" className={styles.logoLink}>
                <Image
                    src={LogoDarkImg}
                    alt="TeamConnect Logo"
                    width={220}
                />
            </a>
            {
                // Don't show the event info in the config page
                session && eventData && (
                    <div className={styles.eventInfoWrapper}>
                        {/* <p>{eventData?.adminEmail === session.user.email && `Current Event: `}</p> */}
                        <h2 className={styles.eventName}>{eventData?.name && `${eventData?.name}`}</h2>

                        {
                            // Show the leave button only if the user is not the event admin
                            eventData?.adminEmail !== session.user.email && (
                                <>
                                    <IconButton aria-label="expand" sx={{ color: '#1C1C1C' }} onClick={handleLeaveButtonClick}>
                                        <PersonRemoveIcon fontSize="medium" />
                                    </IconButton>

                                    <Dialog
                                        open={confirmationDialogOpen}
                                        onClose={handleConfirmationDialogClose}
                                    >
                                        <DialogTitle>Confirm leaving the Event</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                {
                                                    `Are you sure you want to leave ${eventData?.name}. You will no longer be able to access this event. If you're a project admin the entire project will be deleted.`
                                                }
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                                            <Button onClick={handleEventLeave} color="error">Leave</Button>
                                        </DialogActions>
                                    </Dialog>
                                </>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}
