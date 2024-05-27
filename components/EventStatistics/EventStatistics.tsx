"use client"

import React, { useEffect, useState } from "react";
import {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import styles from "./EventStatistics.module.scss"
import NumberCard from "@/components/NumberCard/NumberCard";
import DoughnutChart from "@/components/DoughnutChart/DoughnutChart";
import { getUserCnt } from "./GetUsersAction";
import { getProjectCnt } from "./GetProjectsAction";
import { countSingleUserProjects } from "./GetUsersForProjectAction";
import { countProjectTypes } from "./GetTypeForProjectAction";
import { countUserExpertise } from "./GetExpertiseForUsersAction";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EventStatistics(props: CircularProgressProps & { session: any, eventId: any, key: any }) {
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

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
        Promise.all([
            fetchProjectCnt(),
            fetchProjectUserCnt(),
            fetchProjectTypeCnt(),
        ]).then(() => setIsLoadingProjects(false));

        Promise.all([
            fetchUserCnt(),
            fetchUserExpertiseCnt()
        ]).then(() => setIsLoadingUsers(false));
    }, []);

    function Box({ children }: any) {
        return (
            <div
                style={{
                    display: 'block',
                    lineHeight: 3.1,
                }}
                className={styles.skeletonContainer}
            >
                {children}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Statistics</h5>
            </div>
            <div className={styles.contentArea}>
                <div className={styles.doughnutChart}>
                    {
                        isLoadingProjects ? <Skeleton wrapper={Box} height={27} count={4} width={"100%"} /> : (
                            <>
                                <div className={styles.numbersArea}>
                                    <NumberCard number={projectCountResult.allProjects} text={"All Projects"} />
                                    <NumberCard number={projectUserCountResult} text={"Solo projects"} />
                                </div>
                                <div className={styles.chartArea}>
                                    <DoughnutChart id={'projectChart'} chartData={projectTypeCountResult} />
                                </div>
                            </>
                        )
                    }

                </div>
                <div className={styles.doughnutChart}>
                    {
                        isLoadingUsers ? <Skeleton wrapper={Box} height={27} count={4} /> : (
                            <>
                                <div className={styles.numbersArea}>
                                    <NumberCard number={userCountResult.usersWithoutProject} text={"Available Users"} />
                                    <NumberCard number={userCountResult.userCount} text={"All Users"} />
                                </div>
                                <div className={styles.chartArea}>
                                    <DoughnutChart id={'userChart'} chartData={userExpertiseCountResult} />
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        </div>

    )
}
