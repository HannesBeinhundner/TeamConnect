"use client";

import styles from "./Login.module.scss"
import { signIn } from "next-auth/react";
import Button from '@mui/material/Button'
import Link from "next/link";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg'
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function AuthButtons({ eventData }: { eventData: any }) {

    return (
        <>
            {eventData ? (
                // Login via invite Link
                <>
                    <h2>You have been invited to {eventData.name}!</h2>
                    <Button variant="contained" color="primary" onClick={() => signIn("google", { callbackUrl: `${window.location.origin}/${eventData.id}` })} startIcon={<GoogleIcon />} >Sign in with Google</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("github", { callbackUrl: `${window.location.origin}/${eventData.id}` })} startIcon={<GitHubIcon />} >Sign in with Github</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("twitter", { callbackUrl: `${window.location.origin}/${eventData.id}` })} startIcon={<XIcon />} >Sign in with X</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("linkedin", { callbackUrl: `${window.location.origin}/${eventData.id}` })} startIcon={<LinkedInIcon />} >Sign in with LinkedIn</Button>
                </>
            ) : (
                // normal Login
                <>
                    <Button variant="contained" color="primary" onClick={() => signIn("google")} startIcon={<GoogleIcon />} >Sign in with Google</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("github")} startIcon={<GitHubIcon />}> Sign in with Github</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("twitter")} startIcon={<XIcon />}> Sign in with X</Button>
                    <Button variant="contained" color="primary" onClick={() => signIn("linkedin")} startIcon={<LinkedInIcon />}> Sign in with LinkedIn</Button>
                </>
            )}
        </>
    );
}

export default function Login({ eventData }: { eventData: any }) {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src={LogoDarkImg}
                    alt="TeamConnect Logo"
                    layout="responsive"
                    className={styles.image}
                    style={{
                        objectFit: 'cover',
                    }}
                />
                <p>simplify the interdisciplinary team and project finding phase</p>
            </Link>
            <AuthButtons eventData={eventData} />
            <div className={styles.informationWrapper}>
                <p className={styles.informationLink}>Need more information? <Link href="https://teamconnect-home.vercel.app/" target="_blank">Click here</Link></p>
                <p className={styles.imprintLink}><Link href="./imprint/">Imprint & Privacy Policy</Link></p>
            </div>
        </div>
    )
}
