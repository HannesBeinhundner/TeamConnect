import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options"
import TopArea from "@/components/TopArea/TopArea";
import MainArea from "@/components/MainArea/MainArea";
import OptionsArea from "@/components/OptionsArea/OptionsArea";
import styles from "@/styles/dashboard.module.scss";
import ConfigCard from "@/components/ConfigCard/ConfigCard";
import { getEvent } from '@/app/lib/GetEventAction';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Config({ params }: { params: any }) {
    const eventId = params.eventId;
    console.log(eventId);
    // @ts-ignore
    const session = await getServerSession(options);
    if (!session || !session.user) {
        redirect("/");
    }

    // const eventData: any = await getEvent(eventId);
    // if (!eventData) {
    //     redirect("/");
    // }

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
                    <TopArea session={null} eventData={null} />
                </div>
                <div className={styles.optionsArea}>
                    <OptionsArea session={session} eventData={null} />
                </div>
                <div className={styles.mainArea}>
                    <MainArea
                        bottomLeftComponent={<ConfigCard />}
                    />
                </div>
            </div>
        </>
    );
}