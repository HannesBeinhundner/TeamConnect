import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options"
import LoginCard from "@/components/LoginCard/LoginCard";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";


export default async function Home() {
  // @ts-ignore
  const session = await getServerSession(options)
  const sessionEmail = session?.user?.email
  let user

  sessionEmail && (user = await prisma.user.findUnique({
    where: {
      email: sessionEmail,
    },
  }));

  //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!", user?.eventId);

  return (
    <>
      {user ? (
        redirect(`/${user?.eventId}`)  //HAS SESSION -> Redirect to dashboard
      ) : (
        <LoginCard eventId={null} /> //HAS NO SESSION -> Show the login mask
      )}
    </>
  );
}