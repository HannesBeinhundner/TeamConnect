"use client"

import React, { useState, useEffect } from 'react';
import styles from "./OptionsArea.module.scss"
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import ProfileEditDialog from '../ProfileEditDialog/ProfileEditDialog';
import { getProfile } from './GetProfileAction';
import Badge from '@mui/material/Badge';

interface Props {
    session: any;
    eventData?: any;
}

export default function OptionsArea({ session, eventData }: Props) {

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [profileResult, setProfileResult] = useState<any>([]);
    const [missingProfileData, setMissingProfileData] = useState(false);

    const fetchProfileStatus = async () => {
        const profileResult: any = await getProfile(session.user.email);
        setProfileResult(profileResult);

        const isMissingProfileData = (profileResult?.data?.expertise === '') || (profileResult?.data?.expertise === null) || (profileResult?.data?.description === '') || (profileResult?.data?.description === null);
        setMissingProfileData(isMissingProfileData);

        // If user has not set expertise or description and
        // there is a valid eventID (for first time admins), open ProfileEditDialog window
        isMissingProfileData && eventData?.id && setUpdateDialogOpen(true)
    };

    useEffect(() => {
        fetchProfileStatus();
    }, []);

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    return (
        <div className={styles.container}>
            {
                //Check if current user is admin of event, if so show Link to config page
                session.user.email === eventData?.adminEmail && (
                    <Link href={`/config`} className={styles.config}>
                        <IconButton aria-label="config" sx={{ color: '#1C1C1C' }} >
                            <SettingsIcon />
                        </IconButton>
                    </Link>
                )
            }
            {/* <NotificationsIcon /> */}
            <div className={styles.profile}>
                {session.user.image !== null ? (
                    // If user has not set expertise or description, set a badge on the profile picture
                    missingProfileData && eventData?.id ? (
                        <Badge color="error" badgeContent="!">
                            <Image
                                aria-label="expand"
                                onClick={handleUpdateDialogOpen}
                                className={styles.profile}
                                src={session.user.image}
                                width={42}
                                height={42}
                                alt="Profile picture of user"
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </Badge>
                    ) : (
                        <Image
                            aria-label="expand"
                            onClick={handleUpdateDialogOpen}
                            className={styles.profile}
                            src={session.user.image}
                            width={42}
                            height={42}
                            alt="Profile picture of user"
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                    )
                ) : (
                    <ManageAccountsIcon
                        aria-label="expand"
                        onClick={handleUpdateDialogOpen}
                        className={styles.profile}
                        sx={{ fontSize: 36 }}
                    />
                )}
            </div>

            {/* <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value="bottom"
                        control={<Switch size="small" color="primary" />}
                        label="Night"
                        labelPlacement="bottom"
                    />
                </FormGroup>
            </FormControl> */}
            <IconButton aria-label="logout" onClick={() => signOut()} sx={{ color: '#1C1C1C' }} className={styles.signOut}>
                <LogoutIcon />
            </IconButton>
            <ProfileEditDialog
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                profileResult={profileResult.data}
                eventData={eventData}
                reloadComponent={fetchProfileStatus}
            />
        </div>
    )
}
