"use client";

import styles from "./Login.module.scss"
import { signIn, signOut, useSession } from "next-auth/react";
import Button from '@mui/material/Button'
import Link from "next/link";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg'

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
        </div>
    )
}
