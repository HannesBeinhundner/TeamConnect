import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import InnerArea from "@/components/InnerArea/InnerArea";

export default async function Home() {
  //@ts-ignore
  const session = await getServerSession(options);

  return (
    <>
      ServerComponent Result:
      {session?.user?.name ? (
        <div>{session?.user?.name}</div>
      ) : (
        <div>Not logged in</div>
      )}
      <InnerArea />
    </>
  );
}