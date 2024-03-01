import Link from "next/link";
import Image from "next/image";
import LogoDarkImg from '@/images/logo_dark.svg';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import styles from "./TopArea.module.scss";

const steps = [
    { label: 'Submission Exposé', date: '26.04.2024' },
    { label: 'Entry in Portfolio', date: '26.07.2024' },
    { label: 'Update Portfolio', date: '20.08.2024' },
    { label: 'Project fixation', date: '31.08.2024' },
];

const stepLabelStyle = {
    ".mui-5340bo-MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
        marginTop: 0.75,
        fontSize: 13,
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
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel className={styles.milestone}>
                                {step.label}
                                <br></br>
                                <Typography variant="caption">{step.date}</Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    );
}
