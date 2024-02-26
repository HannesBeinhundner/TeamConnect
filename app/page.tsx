import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options"
import LoginCard from "@/components/LoginCard/LoginCard";
import { redirect } from "next/navigation";


export default async function Home() {
  // @ts-ignore
  const session = await getServerSession(options);

  return (
    <>
      {session?.user?.name ? (
        redirect("/dashboard")  //HAS SESSION -> Redirect to dashboard
      ) : (
        <LoginCard /> //HAS NO SESSION -> Show the login mask
      )}
    </>
  );
}