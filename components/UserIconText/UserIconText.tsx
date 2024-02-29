import styles from "./UserIconText.module.scss"
import { ReactNode } from "react";


interface UserIconTextProps {
    icon: ReactNode;
    smallText: string;
    text: string;
}

export default function UserIconText({ icon, smallText, text }: UserIconTextProps) {
    return (
        <div className={styles.container}>
            {icon}
            <div className={styles.textArea}>
                <p className={styles.smallText}>{smallText}</p>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    )
}
