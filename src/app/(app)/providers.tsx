'use client'

import { Provider } from "react-redux"
import { store } from "@/redux/store"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import React from "react"
import AuthProvider from "@/context/authProvider"
import { ThemeProvider as NextThemesProvider } from 'next-themes';


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextThemesProvider attribute="class">
                <AuthProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
                        <Provider store={store}>
                            {children}
                        </Provider>
                    </ThemeProvider>
                </AuthProvider>
            </NextThemesProvider>
        </SessionProvider>
    )
}