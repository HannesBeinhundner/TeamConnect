import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import NavMenu from "@/components/NavMenu";
import { options } from "./api/auth/[...nextauth]/options";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //@ts-ignore
  const session = await getServerSession(options);
  console.log("My session: ", session)

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <SessionProvider session={session}>
          <main className="min-h-screen flex flex-col items-center">
            <NavMenu />
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>{children}</AppRouterCacheProvider>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
