import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import findTeamMembersImg from "@/images/findTeamMembers.svg";
import backToDashboardImg from "@/images/backToDashboard.svg";
import NavigationButton from "@/components/NavigationButton/NavigationButton";
import styles from "@/styles/dashboard.module.scss"
import ViewAllProjects from "@/components/ViewAllProjects/ViewAllProjects";
import { getEvent } from '@/app/lib/GetEventAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Projects({ params }: { params: any }) {
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
                    <OptionsArea session={session} eventData={eventData} />
                </div>
                <div className={styles.mainArea}>
                    <MainArea
                        topRightComponent={<NavigationButton
                            href="./"
                            imgSrc={backToDashboardImg}
                            altText="Illustration of a team celebrating together"
                            buttonText="Back to Dashboard"
                        />}
                        topLeftComponent={<NavigationButton
                            href="./members"
                            imgSrc={findTeamMembersImg}
                            altText="Illustration of a team working together"
                            buttonText="Find team members"
                        />}
                        bottomLeftComponent={<ViewAllProjects session={session} eventData={eventData} />}
                    />
                </div>
            </div>
        </>
    )
}
