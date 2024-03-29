
import styles from "./LoginCard.module.scss"
import Link from "next/link";
import Image from "next/image";
import LoginImg from '@/images/login_dark.svg'
import Login from "../Login/Login";

export default function LoginCard({ eventId }: { eventId: any }) {
    return (
        <div className={styles.container}>
            <Login eventId={eventId} />
            <Image
                src={LoginImg}
                alt="Illustration of a team working together"
                width={600}
            />
        </div>
    )
}
