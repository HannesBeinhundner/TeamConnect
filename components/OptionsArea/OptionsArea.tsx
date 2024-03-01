"use client"

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
import ProfileGirl from "@/images/profile_girl.png"
import { signIn, signOut, useSession } from "next-auth/react";


export default function OptionsArea() {
    return (
        <div className={styles.container}>
            <IconButton aria-label="logout" onClick={() => signOut()} sx={{ color: '#1C1C1C' }}>
                <LogoutIcon />
            </IconButton>
            <NotificationsIcon />
            <Link href="#" className={styles.profile}>
                <Image
                    className={styles.profile}
                    src={ProfileGirl}
                    alt="Girl"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </Link>
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
        </div>
    )
}
