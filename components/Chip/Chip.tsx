import styles from "./Chip.module.scss"
import { ReactNode } from "react";


interface ChipProps {
    icon: ReactNode;
    text: string;
}

export default function Chip({ icon, text }: ChipProps) {
    return (
        <div className={styles.container}>
            {icon}
            <p>{text}</p>
        </div>
    )
}
