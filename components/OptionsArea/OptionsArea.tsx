"use client"

import React, { useState, useEffect } from 'react';
import styles from "./OptionsArea.module.scss"
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import ProfileEditDialog from '../ProfileEditDialog/ProfileEditDialog';
import { getProfile } from './GetProfileAction';

interface Props {
    session: any;
}

export default function OptionsArea({ session }: Props) {

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [profileResult, setProfileResult] = useState<any>([]);

    const fetchProfileStatus = async () => {
        const profileResult: any = await getProfile(session.user.email);
        setProfileResult(profileResult);
        console.log(profileResult.data)
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
    console.log(session.user.image)
    return (
        <div className={styles.container}>
            <IconButton aria-label="logout" onClick={() => signOut()} sx={{ color: '#1C1C1C' }}>
                <LogoutIcon />
            </IconButton>
            <NotificationsIcon />
            <div className={styles.profile}>
                {session.user.image !== null ? (
                    <Image
                        aria-label="expand"
                        onClick={handleUpdateDialogOpen}
                        className={styles.profile}
                        src={session.user.image}
                        width={40}
                        height={40}
                        alt="Profile picture of user"
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <AccountCircleIcon
                        aria-label="expand"
                        onClick={handleUpdateDialogOpen}
                        className={styles.profile}
                        sx={{ fontSize: 36 }}
                    />
                )}
            </div>
            <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value="bottom"
                        control={<Switch size="small" color="primary" />}
                        label="Night"
                        labelPlacement="bottom"
                    />
                </FormGroup>
            </FormControl>
            <ProfileEditDialog
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                profileResult={profileResult.data}
            />
        </div>
    )
}
