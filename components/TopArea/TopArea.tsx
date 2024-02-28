import Link from "next/link";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg'


import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import styles from "./TopArea.module.scss"

const steps = [
    'Submission Exposé',
    'Entry in Portfolio',
    'Update Portfolio',
    'Project fixation',
];

const stepLabelStyle = {
    ".MuiStepLabel-label": {
        marginTop: 0.6,
        fontSize: 14,
    },
};

export default function TopArea() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src={LogoDarkImg}
                    alt="TeamConnect Logo"
                    width={220}
                />
            </Link>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={1} alternativeLabel sx={stepLabelStyle}>
                    {steps.map((label) => (
                        <Step key={label} >
                            <StepLabel className={styles.milestone} >
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
