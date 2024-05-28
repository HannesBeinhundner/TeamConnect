import styles from "./LoginCard.module.scss"
import Image from "next/image";
import LoginImg from '@/images/login_dark.svg'
import Login from "../Login/Login";

export default function LoginCard({ eventData }: { eventData: any }) {
    return (
        <div className={styles.container}>
            <Login eventData={eventData} />
            <div className={styles.imageContainer}>
                <Image
                    src={LoginImg}
                    alt="Illustration of a team working together"
                    layout="responsive"
                    className={styles.image}
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </div>
        </div>
    )
}
