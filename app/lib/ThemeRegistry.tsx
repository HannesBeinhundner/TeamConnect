"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { Inter } from 'next/font/google'
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

const inter = Inter({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal"],
    subsets: ["latin"],
});
const { palette } = createTheme();
const themeOptions: ThemeOptions = {
    typography: {
        fontSize: 14,
        fontFamily: inter.style.fontFamily,
    },
    palette: {
        // background: {
        //     // pink
        //     default: "#f8bbd0",
        // },
        // primary: {
        //     main: "#1976d2",
        // },
        // text: {
        //     primary: "#EDEDED",
        //     secondary: "#161616",

        // },
    },
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}