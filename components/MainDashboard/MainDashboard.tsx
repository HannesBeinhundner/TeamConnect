"use client"
import { useEffect, useState } from 'react';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import YourProjectCard from "@/components/YourProjectCard/YourProjectCard";
import EventStatistics from "@/components/EventStatistics/EventStatistics";
import findTeamMembersImg from "@/images/findTeamMembers.svg";
import viewAllProjectsImg from "@/images/viewAllProjects.svg";
import NavigationButton from "@/components/NavigationButton/NavigationButton";
import styles from "@/styles/dashboard.module.scss";
import React, { Suspense, use } from 'react';
import { getEvent } from '@/app/lib/GetEventAction';
import { prisma } from "@/prisma";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
export default function MainDashboard({ session, eventData, paramEventId, joined }) {
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (joined) {
            toast.success('You joined the project successfully!');
            //remove parameter from url, so that the toast message is not shown again
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [joined]);

    const reloadComponent = () => {
        setKey(prevKey => prevKey + 1); // Update key to force remount
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                theme="light"
            />
            <div className={styles.container}>
                <div className={styles.topArea}>
                    <TopArea session={session} eventData={eventData} />
                </div>
                <div className={styles.optionsArea}>
                    <OptionsArea session={session} eventData={eventData} profileDisabled={false} />
                </div>
                <div className={styles.mainArea}>
                    <MainArea
                        topLeftComponent={<NavigationButton
                            href={`./${paramEventId}/members`}
                            imgSrc={findTeamMembersImg}
                            altText="Illustration of a team celebrating together"
                            buttonText="Find Team Members"
                        />}
                        topRightComponent={<NavigationButton
                            href={`./${paramEventId}/projects`}
                            imgSrc={viewAllProjectsImg}
                            altText="Illustration of a team working together"
                            buttonText="View all projects"
                        />}
                        bottomLeftComponent={<YourProjectCard eventId={paramEventId} reloadComponent={reloadComponent} key={key} />}
                        bottomRightComponent={
                            <EventStatistics session={session} eventId={paramEventId} key={key} />
                        }
                    />
                </div>
            </div>
        </>
    );
}