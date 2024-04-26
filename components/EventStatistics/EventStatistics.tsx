"use client"

import React, { useEffect } from "react";
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from "./EventStatistics.module.scss"
import NumberCard from "@/components/NumberCard/NumberCard";
import DoughnutChart from "@/components/DoughnutChart/DoughnutChart";
import { projectTypes } from '@/app/lib/data'
import { getUserCnt } from "./GetUsersAction";
import { getProjectCnt } from "./GetProjectsAction";
import { countSingleUserProjects } from "./GetUsersForProjectAction";
import { countProjectTypes } from "./GetTypeForProjectAction";
import { countUserExpertise } from "./GetExpertiseForUsersAction";

export default function EventStatistics(props: CircularProgressProps & { value: number, session: any, eventId: any }) {
    const [progress, setProgress] = React.useState(10);
    const [userCountResult, setUserCnt] = React.useState<any>([]);
    const [projectCountResult, setProjectCount] = React.useState<any>([]);
    const [projectUserCountResult, setProjectUserCount] = React.useState<any>([]);
    const [projectTypeCountResult, setProjectTypeCount] = React.useState<any>([]);
    const [userExpertiseCountResult, setUserExpertiseCountCount] = React.useState<any>([]);

    const fetchUserCnt = async () => {
        const userCountResult = await getUserCnt(props.eventId);
        setUserCnt(userCountResult);
    };

    const fetchProjectCnt = async () => {
        const projectCountResult = await getProjectCnt(props.eventId);
        setProjectCount(projectCountResult);
    };

    const fetchProjectUserCnt = async () => {
        const projectUserCountResult = await countSingleUserProjects(props.eventId);
        setProjectUserCount(projectUserCountResult);
    };

    const fetchProjectTypeCnt = async () => {
        const projectTypeCountResult = await countProjectTypes(props.eventId);
        setProjectTypeCount(projectTypeCountResult);
    };

    const fetchUserExpertiseCnt = async () => {
        const userExpertiseCountResult = await countUserExpertise(props.eventId);
        setUserExpertiseCountCount(userExpertiseCountResult);
    };

    useEffect(() => {
        fetchUserCnt();
        fetchProjectCnt();
        fetchProjectUserCnt();
        fetchProjectTypeCnt();
        fetchUserExpertiseCnt();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Statistics</h5>
            </div>
            <div className={styles.contentArea}>
                <div className={styles.doughnutChart}>
                    <div className={styles.numbersArea}>
                        <NumberCard number={projectCountResult.allProjects} text={"All Projects"} />
                        <NumberCard number={projectUserCountResult} text={"Teamless projects"} />
                    </div>
                    <div className={styles.chartArea}>
                        <DoughnutChart id={'projectChart'} chartData={projectTypeCountResult} />
                    </div>
                </div>
                <div className={styles.doughnutChart}>
                    <div className={styles.numbersArea}>
                        <NumberCard number={userCountResult.usersWithoutProject} text={"Available Users"} />
                        <NumberCard number={userCountResult.userCount} text={"All Users"} />
                    </div>
                    <div className={styles.chartArea}>
                        <DoughnutChart id={'userChart'} chartData={userExpertiseCountResult} />
                    </div>
                </div>
            </div>
        </div>

    )
}
