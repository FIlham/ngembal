import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";

const publicSansHeading = Public_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
});

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    // title: "Ngembal",
    metadataBase: new URL(env.BETTER_AUTH_URL), // TODO: Replace with your actual production domain
    title: {
        default: "Ngembal",
        template: "%s | Ngembal", // Automatically adds "| Ngembal" to sub-page titles
    },
    description: "Sosmed-like web app",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Ngembal",
        description: "Sosmed-like web app",
        type: "website",
        siteName: "Ngembal",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ngembal",
        description: "Sosmed-like web app",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-sans",
                figtree.variable,
                publicSansHeading.variable,
            )}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
