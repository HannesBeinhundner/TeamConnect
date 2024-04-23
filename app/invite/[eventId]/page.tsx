import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options"
import LoginCard from "@/components/LoginCard/LoginCard";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { getEvent } from "@/app/lib/GetEventAction";


export default async function Invite({ params }: { params: any }) {
    // @ts-ignore
    const eventId = params.eventId;
    let showUserLogin = false;

    //Check if eventId is valid and exists in the database
    const eventData: any = await getEvent(eventId);
    if (eventData) {
        // @ts-ignore
        //Check if user has a session
        const session = await getServerSession(options);
        if (session) {
            //add user to the database with the correct eventId of the invite
            const sessionEmail = session?.user?.email

            const event = await prisma.user.update({
                where: { email: sessionEmail ?? undefined },
                data: {
                    eventId: eventId
                }
            });

            redirect(`/${eventId}`);  //HAS EVENT AND SESSION -> Redirect to dashboard
        }
        else {
            showUserLogin = true //NO SESSION -> Redirect to user login
        }
    } else {
        redirect("/"); //NO EVENT FOUND -> Redirect to admin login
    }

    return (
        <>
            {
                showUserLogin && <LoginCard eventData={eventData} />
            }
        </>
    );
}