import Link from "next/link";
import Image from "next/image";
import LogoWhiteImg from '@/images/logo_white.svg'
import styles from "./TopArea.module.scss"

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = [
    'Submission Exposé',
    'Entry in Portfolio',
    'Update Portfolio',
    'Project fixation',
];

export default function TopArea() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src={LogoWhiteImg}
                    alt="TeamConnect Logo"
                    width={220}
                />
            </Link>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>
                                {label}
                                <br></br>
                                <Typography variant="caption">Optional</Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    )
}
