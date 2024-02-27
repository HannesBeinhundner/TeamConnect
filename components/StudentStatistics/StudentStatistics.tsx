"use client"

import React from "react";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from "./StudentStatistics.module.scss"
import NumberCard from "@/components/NumberCard/NumberCard";


export default function StudentStatistics(props: CircularProgressProps & { value: number },) {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Statistics</h5>
            </div>
            <div className={styles.contentArea}>
                <NumberCard number={"23"} text={"Days till deadline"} />
                <NumberCard number={"21"} text={"Projects"} />
                <NumberCard number={"101"} text={"Available students"} />
                <div className={styles.circularProgressBarContainer}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress thickness={4.5} size={60} variant="determinate" {...props} />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <p className={styles.progressNumber}
                            >{`${Math.round(props.value)}%`}</p>
                        </Box>
                    </Box>
                    <p className={styles.progressText}>Deadlines completed</p>
                </div>
            </div>

        </div>

    )
}
