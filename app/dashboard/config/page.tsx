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
import ConfigCard from "@/components/ConfigCard/ConfigCard";

export default async function Config() {
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
                    bottomLeftComponent={<ConfigCard />}
                />
            </div>
        </div>
    );
}