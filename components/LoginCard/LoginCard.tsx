
import styles from "./LoginCard.module.scss"
import Link from "next/link";
import Image from "next/image";
import LoginImg from '@/images/login_dark.svg'
import Login from "../Login/Login";

export default function LoginCard() {
    return (
        <div className={styles.container}>
            <Login />
            <Image
                src={LoginImg}
                alt="Illustration of a team working together"
                width={600}
            />
        </div>
    )
}
