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


export default async function Projects() {
    // @ts-ignore
    const session = await getServerSession(options);
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <div className={styles.container}>
            <div className={styles.topArea}>
                <TopArea />
            </div>
            <div className={styles.optionsArea}>
                <OptionsArea />
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
                        href="../dashboard/projects"
                        imgSrc={viewAllProjectsImg}
                        altText="Illustration of a team working together"
                        buttonText="View all projects"
                    />}
                    bottomLeftComponent={<FindTeamMembers />}
                />
            </div>
        </div>
    )
}
