"use client"

import { Chart } from "chart.js";
import React, { useEffect } from "react";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from "./StudentStatistics.module.scss"
import NumberCard from "@/components/NumberCard/NumberCard";
import { projectTypes } from '@/app/lib/data'


export default function StudentStatistics(props: CircularProgressProps & { value: number },) {
    const [progress, setProgress] = React.useState(10);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    //     }, 800);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    useEffect(() => {
        //@ts-ignore
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [projectTypes.web, projectTypes.game, projectTypes.film, projectTypes.audio, projectTypes.computeranimation, projectTypes.communicationdesign, projectTypes.multimedia, projectTypes.other],
                datasets: [{
                    data: [10, 20, 20, 10, 10, 10, 10, 10],
                    borderColor: [
                        "#007DFF",
                        "#0057B2",
                        "#FF6666", // Light Red
                        "#6F2931",
                        "#CC0000", // Dark Red
                        "#66B2FF", // Light Blue
                        "#003366",

                    ],
                    backgroundColor: [
                        "#007DFF",
                        "#0057B2",
                        "#FF6666", // Light Red
                        "#6F2931",
                        "#CC0000", // Dark Red
                        "#66B2FF", // Light Blue
                        "#003366",

                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        display: false,
                    }],
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        fontSize: 10, // Adjust the legend label font size
                        boxWidth: 15, // Adjust the width of the colored box in the legend label
                    },
                },
            },


        });
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Statistics</h5>
            </div>
            <div className={styles.contentArea}>
                <div className={styles.projectChart}>
                    <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl pb-2 test'>
                        <canvas id='myChart' style={{ width: '100%', maxWidth: '370px' }}></canvas>
                    </div>
                </div>

                <div className={styles.numbersArea}>
                    <NumberCard number={"23"} text={"Days till deadline"} />
                    <NumberCard number={"101"} text={"Available students"} />
                    {/* <div className={styles.circularProgressBarContainer}>
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
                </div> */}
                    <NumberCard number={"25%"} text={"Deadlines completed"} />
                    <NumberCard number={"21"} text={"Projects"} />
                    <NumberCard number={"5"} text={"Accepted projects"} />
                    <NumberCard number={"4"} text={"Teamless projects"} />

                </div>
            </div>
        </div>

    )
}
