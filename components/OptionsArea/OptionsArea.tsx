import styles from "./OptionsArea.module.scss"
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Link from "next/link";
import Image from "next/image";
import ProfileGirl from "@/images/profile_girl.png"


export default function OptionsArea() {
    return (
        <div className={styles.container}>
            <NotificationsIcon />
            <Link href="/profile" className={styles.profile}>
                <Image
                    className={styles.profile}
                    src={ProfileGirl}
                    alt="Girl"
                    style={{
                        objectFit: 'cover',
                    }}
                />
            </Link>
            <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value="bottom"
                        control={<Switch defaultChecked size="small" color="primary" />}
                        label="Night"
                        labelPlacement="bottom"
                    />
                </FormGroup>
            </FormControl>
        </div>
    )
}
