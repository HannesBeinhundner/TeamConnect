import styles from "./NumberCard.module.scss"

interface NumberCardProps {
    number: string;
    text: string;
}

export default function NumberCard({ number, text }: NumberCardProps) {
    return (
        <div className={styles.container}>
            <h4>
                {number}
            </h4>
            <p>{text}</p>
        </div>
    )
}
