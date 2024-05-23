import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import viewAllProjectsImg from "@/images/viewAllProjects.svg";
import backToDashboardImg from "@/images/backToDashboard.svg";
import NavigationButton from "@/components/NavigationButton/NavigationButton";
import styles from "@/styles/dashboard.module.scss"
import FindTeamMembers from "@/components/FindTeamMembers/FindTeamMembers";
import { getEvent } from '@/app/lib/GetEventAction';
import { prisma } from "@/prisma";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Members({ params }: { params: any }) {
    const eventId = params.eventId;

    // @ts-ignore
    const session = await getServerSession(options);
    if (!session || !session.user) {
        redirect("/");
    }

    const eventData: any = await getEvent(eventId);
    if (!eventData) {
        redirect("/");
    }

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
                            href="../"
                            imgSrc={backToDashboardImg}
                            altText="Illustration of a team celebrating together"
                            buttonText="Back to Dashboard"
                        />}
                        topRightComponent={<NavigationButton
                            href={`./projects`}
                            imgSrc={viewAllProjectsImg}
                            altText="Illustration of a team working together"
                            buttonText="View all projects"
                        />}
                        bottomLeftComponent={<FindTeamMembers session={session} eventData={eventData} />}
                    />
                </div>
            </div>
        </>
    )
}
