"use client";

import styles from "./Login.module.scss"
import { signIn, signOut, useSession } from "next-auth/react";
import Button from '@mui/material/Button'
import Link from "next/link";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg'
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function AuthButton() {
    // const { data: session } = useSession();
    // if (session) {
    //     return (
    //         redirect("/dashboard")
    //     );
    // }
    return (
        <>
            {/* NOT SINGED IN */}
            <Button variant="contained" color="primary" onClick={() => signIn("teamconnect")}>Sign in with FH</Button>
            <Button variant="contained" color="primary" onClick={() => signIn("google")} startIcon={<GoogleIcon />} >Sign in with Google</Button>
            <Button variant="contained" color="primary" onClick={() => signIn("github")} startIcon={<GitHubIcon />}> Sign in with Github</Button>
            <Button variant="contained" color="primary" onClick={() => signIn("facebook")} startIcon={<FacebookIcon />} >Sign in with Facebook</Button>
            <Button variant="contained" color="primary" onClick={() => signIn("twitter")} startIcon={<XIcon />}> Sign in with X</Button>
            <Button variant="contained" color="primary" onClick={() => signIn("linkedin")} startIcon={<LinkedInIcon />}> Sign in with LinkedIn</Button>
        </>
    );
}

export default function Login() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src={LogoDarkImg}
                    alt="TeamConnect Logo"
                    width={340}
                />
                <p>simplify the interdisciplinary team and project finding phase</p>
            </Link>
            <AuthButton />
            <p className={styles.informationLink}>Need more information? <Link href="https://teamconnect-home.vercel.app/" target="_blank">Click here</Link></p>
        </div>
    )
}
