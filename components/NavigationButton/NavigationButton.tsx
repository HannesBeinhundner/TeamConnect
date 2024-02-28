
import Link from "next/link";
import Image from "next/image";
import styles from "./NavigationButton.module.scss"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface NavigationButtonProps {
    href: string;
    imgSrc: string;
    altText: string;
    buttonText: string;
}

export default function NavigationButton({ href, imgSrc, altText, buttonText }: NavigationButtonProps) {
    return (
        <Link href={href} className={styles.container}>
            <div className={styles.textarea}>
                <h3>{buttonText}</h3>
                <KeyboardArrowRightIcon fontSize="large" />
            </div>
            <Image
                src={imgSrc}
                alt={altText}
                width={400}
                style={{
                    objectFit: 'cover',
                }}
            />
        </Link>
    )
}
