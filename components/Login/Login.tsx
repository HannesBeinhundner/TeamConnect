"use client";

import styles from "./Login.module.scss"
import { signIn, signOut, useSession } from "next-auth/react";
import Button from '@mui/material/Button'
import Link from "next/link";
import Image from "next/image";
import LogoWhiteImg from '@/images/logo_white.svg'

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
            <Button variant="contained" color="primary" onClick={() => signIn()}>Sign in with FH</Button>
        </>
    );
}

export default function Login() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src={LogoWhiteImg}
                    alt="TeamConnect Logo"
                    width={320}
                />
                <p>simplify the interdisciplinary team and project finding phase</p>
            </Link>
            <AuthButton />
        </div>
    )
}
