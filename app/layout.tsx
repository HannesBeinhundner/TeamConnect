import { Inter } from 'next/font/google'
import "@/styles/globals.scss";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { options } from "@/app/api/auth/[...nextauth]/options"
import ThemeRegistry from "@/app/lib/ThemeRegistry";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ProgressProvider from '@/components/ProgressBarProvider/ProgressBarProvider';


const defaultUrl = process.env.PRODUCTION
  ? "https://teamconnect.projects.multimediatechnology.at"
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "TeamConnect",
  description: "Simplify the interdisciplinary team and project finding phase",
};

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // @ts-ignore
  const session = await getServerSession(options);

  const containerStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    // overflowX: 'hidden',
  };

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-foreground" >
        <SessionProvider session={session}>
          <main style={containerStyle}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ThemeRegistry>
                <SkeletonTheme baseColor="#e8e8e8" highlightColor="#d9d9d9">
                  <ProgressProvider>{children}</ProgressProvider>
                </SkeletonTheme>
              </ThemeRegistry>
            </AppRouterCacheProvider>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
