
import styles from "./LoginCard.module.scss"
import Image from "next/image";
import LoginImg from '@/images/login_dark.svg'
import Login from "../Login/Login";

export default function LoginCard({ eventData }: { eventData: any }) {
    return (
        <div className={styles.container}>
            <Login eventData={eventData} />
            <Image
                src={LoginImg}
                alt="Illustration of a team working together"
                width={600}
            />
        </div>
    )
}
