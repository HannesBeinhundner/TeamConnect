import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import YourProjectCard from "@/components/YourProjectCard/YourProjectCard";
import StudentStatistics from "@/components/StudentStatistics/StudentStatistics";
import findTeamMembersImg from "@/images/findTeamMembers.svg";
import viewAllProjectsImg from "@/images/viewAllProjects.svg";
import NavigationButton from "@/components/NavigationButton/NavigationButton";
import styles from "@/styles/dashboard.module.scss";

export default async function Dashboard() {
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
                <OptionsArea session={session} />
            </div>
            <div className={styles.mainArea}>
                <MainArea
                    topLeftComponent={<NavigationButton
                        href="./dashboard/members"
                        imgSrc={findTeamMembersImg}
                        altText="Illustration of a team celebrating together"
                        buttonText="Find Team Members"
                    />}
                    topRightComponent={<NavigationButton
                        href="./dashboard/projects"
                        imgSrc={viewAllProjectsImg}
                        altText="Illustration of a team working together"
                        buttonText="View all projects"
                    />}
                    bottomLeftComponent={<YourProjectCard />}
                    bottomRightComponent={<StudentStatistics value={60} />}
                />
            </div>
        </div>
    );
}