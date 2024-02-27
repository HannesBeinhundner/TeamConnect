import YourProjectCard from "@/components/YourProjectCard/YourProjectCard";
import styles from "./MainArea.module.scss";
import NavigationButton from "../NavigationButton/NavigationButton";
import findTeamMembersImg from "@/images/findTeamMembers.svg";
import viewAllProjectsImg from "@/images/viewAllProjects.svg";
import StudentStatistics from "@/components/StudentStatistics/StudentStatistics";

export default function MainArea() {
    return (
        <div className={styles.container}>
            <div className={styles.topLeft}>
                <NavigationButton
                    href="/members"
                    imgSrc={findTeamMembersImg}
                    altText="Illustration of a team celebrating together"
                    buttonText="Find Team Members"
                />
            </div>
            <div className={styles.topRight}>
                <NavigationButton
                    href="/projects"
                    imgSrc={viewAllProjectsImg}
                    altText="Illustration of a team working together"
                    buttonText="View all projects"
                />
            </div>
            <div className={styles.bottomLeft}>
                <YourProjectCard />
            </div>
            <div className={styles.bottomRight}>
                <StudentStatistics value={60} />
            </div>
        </div>
    );
}
