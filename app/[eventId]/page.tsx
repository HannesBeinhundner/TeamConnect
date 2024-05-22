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
import React, { Suspense } from 'react';
import { getEvent } from '@/app/lib/GetEventAction';
import { prisma } from "@/prisma";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainDashboard from "@/components/MainDashboard/MainDashboard";

// @ts-ignore
export default async function Dashboard({ params, searchParams }) {
    const paramEventId = params.eventId;

    // @ts-ignore
    const session = await getServerSession(options);
    if (!session || !session.user) {
        redirect("/");
    }
    const sessionEmail = session?.user?.email ?? undefined;

    //Get information if the eventId in param is valid and passed
    const eventData: any = await getEvent(paramEventId);
    let paramEventIdIsValid = eventData ? true : false;

    //Get current User iformation
    const user = await prisma.user.findUnique({
        where: { email: sessionEmail }
    });

    //Check if user has no eventId set
    if (!user?.eventId) {
        //Check if eventId in params is valid
        if (paramEventIdIsValid) {
            //Update the user with the correct eventId
            await prisma.user.update({
                where: { email: sessionEmail },
                data: {
                    eventId: paramEventId
                }
            }).catch((err) => {
                console.error("Failed to update user:", err);
            });

        } else {
            //otherwise redirect to config, beacuse the user was not invited to an event
            redirect("../config");
        }
    } else {
        // User has an eventId set

        //the eventId in the params is not valid
        if (!paramEventIdIsValid) {
            redirect("./");
        }

        // if the user has a eventID that is not the passed one already and is not a eventadmin -> Error: User can't join more than one event at the same time
        if ((user?.eventId !== paramEventId) && (user?.email !== eventData?.adminEmail)) {
            console.log("You can't join more than one event at the same time!");
            redirect("./");
        }
    }

    const joined = searchParams.joined === 'true';

    return (
        <MainDashboard session={session} eventData={eventData} paramEventId={paramEventId} joined={joined} />
    )
}