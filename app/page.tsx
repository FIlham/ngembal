import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { ThreadCard } from "@/components/thread-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/database";
import { threads } from "@/database/schema";
import { auth } from "@/lib/auth";

export default async function HomePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const allThreads = await db.query.threads.findMany({
        with: {
            author: true,
            likes: true,
            comments: {
                with: {
                    author: true,
                },
                orderBy: (comments, { asc }) => [asc(comments.createdAt)],
            },
        },
        orderBy: [desc(threads.createdAt)],
    });

    return (
        <main className="min-h-screen bg-background relative">
            <div className="container mx-auto flex justify-center px-0 sm:px-4">
                {/* Left spacing - empty for now */}
                <div className="hidden lg:block w-1/4" />

                {/* Center content - Threads */}
                <div className="w-full max-w-2xl border-x border-muted/30 min-h-screen bg-card/20">
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-muted/30 p-4 flex justify-between items-center">
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                            Home
                        </h1>
                        {session ? (
                            <Link href="/profile/me">
                                <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                                    <AvatarImage
                                        src={session.user.image || undefined}
                                        alt={session.user.name}
                                    />
                                    <AvatarFallback>
                                        {session.user.name
                                            .substring(0, 2)
                                            .toUpperCase() || "NA"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="text-sm text-primary hover:underline"
                            >
                                Log in
                            </Link>
                        )}
                    </header>

                    <div className="flex flex-col gap-4">
                        {allThreads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="bg-muted h-20 w-20 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-4xl">🧵</span>
                                </div>
                                <h3 className="text-lg font-semibold">
                                    No threads yet
                                </h3>
                                <p className="text-muted-foreground mt-2 max-w-62.5">
                                    Be the first one to share something with the
                                    world!
                                </p>
                            </div>
                        ) : (
                            allThreads.map((thread) => (
                                <ThreadCard
                                    key={thread.id}
                                    thread={thread}
                                    currentUserId={session?.user?.id}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right spacing - empty for now */}
                <div className="hidden lg:block w-1/4" />
            </div>

            <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 pointer-events-none flex justify-end px-6 md:px-8">
                <Button
                    asChild
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all pointer-events-auto"
                >
                    <Link href="/thread/create" aria-label="Create new thread">
                        <Plus className="h-6 w-6" />
                    </Link>
                </Button>
            </div>
        </main>
    );
}
