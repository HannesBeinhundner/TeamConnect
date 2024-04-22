import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg';
import Box from '@mui/material/Box';
import styles from "./TopArea.module.scss";

export default function TopArea({ eventData }: { eventData: any }) {
    return (
        <div className={styles.container}>
            <a href="/" className={styles.logoLink}>
                <Image
                    src={LogoDarkImg}
                    alt="TeamConnect Logo"
                    width={220}
                />
                <h3>{eventData?.name ? `Event: ${eventData?.name}` : ""}</h3>
            </a>
            <Box sx={{ width: '100%' }}>
            </Box>
        </div>
    );
}
