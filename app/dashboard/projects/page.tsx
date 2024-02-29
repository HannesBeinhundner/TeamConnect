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
                    topRightComponent={<NavigationButton
                        href="../"
                        imgSrc={backToDashboardImg}
                        altText="Illustration of a team celebrating together"
                        buttonText="Back to Dashboard"
                    />}
                    topLeftComponent={<NavigationButton
                        href="../dashboard/members"
                        imgSrc={findTeamMembersImg}
                        altText="Illustration of a team working together"
                        buttonText="Find team members"
                    />}
                    bottomLeftComponent={<ViewAllProjects />}
                />
            </div>
        </div>
    )
}
