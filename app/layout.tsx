import { Inter } from 'next/font/google'
import "@/styles/globals.scss";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";
import { options } from "@/app/api/auth/[...nextauth]/options"
// import { createTheme, ThemeProvider } from '@mui/material/styles'

// const theme = createTheme({
//   typography: {
//     allVariants: {
//       fontFamily: 'Inter',
//       textTransform: 'none',
//       fontSize: 16
//     }
//   }
// })

const defaultUrl = process.env.PRODUCTION
  ? "https://teamconnect.projects.multimediatechnology.at"
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
    backgroundColor: 'blue',
    //padding: '1.5rem',
    height: '100%',
    width: '100%'
  };

  return (
    <html lang="en" className={inter.className}>
      <body className="bg-background text-foreground">
        <SessionProvider session={session}>
          {/* <ThemeProvider theme={theme}> */}
          <main style={containerStyle}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>{children}</AppRouterCacheProvider>
            <Toaster position="top-right"></Toaster>
          </main>
          {/* </ThemeProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
