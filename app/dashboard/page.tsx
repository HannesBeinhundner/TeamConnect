import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import styles from "@/styles/dashboard.module.scss"


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
                <OptionsArea />
            </div>
            <div className={styles.mainArea}>
                <MainArea />
            </div>
        </div>
    )
}
