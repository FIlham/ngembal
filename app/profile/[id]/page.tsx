import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { ThreadCard } from "@/components/thread-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { threads } from "@/database/schema";
import { auth } from "@/lib/auth";

async function getUserProfile(id: string) {
    // Fetch the user and their threads using Drizzle Relational Queries
    const selectedUser = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, id),
        with: {
            threads: {
                orderBy: (threads, { desc }) => [desc(threads.createdAt)],
            },
        },
    });

    if (!selectedUser) return null;

    const userThreads = await db.query.threads.findMany({
        where: eq(threads.authorId, selectedUser.id),
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

    if (!selectedUser) return null;

    return {
        id: selectedUser.id,
        name: selectedUser.name || "Anonymous",
        bio: selectedUser.bio || "",
        image: selectedUser.image || undefined,
        threads: userThreads,
        createdAt: selectedUser.createdAt,
    };
}

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // In Next.js 15+, params is a Promise
    const { id } = await params;
    const profile = await getUserProfile(id);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                User not found
            </div>
        );
    }

    const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto flex justify-center px-0 sm:px-4">
                {/* Left spacing */}
                <div className="hidden lg:block w-1/4" />

                {/* Center content */}
                <div className="w-full max-w-2xl border-x border-muted/30 min-h-screen bg-card/20">
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-muted/30 p-4 flex items-center gap-4">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            aria-label="Go back"
                        >
                            <Link href="/">
                                <FaArrowLeft />
                            </Link>
                        </Button>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                            Profile
                        </h1>
                    </header>

                    {/* Profile Header Section */}
                    <div className="p-6">
                        <div className="flex flex-col items-center sm:items-start gap-4">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarImage
                                    src={profile.image || undefined}
                                    alt={profile.name}
                                />
                                <AvatarFallback className="text-2xl">
                                    {profile.name
                                        .substring(0, 2)
                                        .toUpperCase() || "NA"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 text-center sm:text-left flex-1">
                                <h2 className="text-2xl font-bold">
                                    {profile.name}
                                </h2>
                                <p className="text-muted-foreground">
                                    {profile.bio || "No bio yet"}
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mt-2">
                                    <FaCalendar />
                                    <span>Joined {joinDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="flex flex-col">
                                <span className="font-bold">
                                    {profile.threads.length}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Threads
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-muted/30" />

                    <div className="flex flex-col gap-4">
                        <div className="p-4 border-b border-muted/30">
                            <h3 className="font-semibold">Threads</h3>
                        </div>
                        {profile.threads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <p className="text-muted-foreground">
                                    You haven't posted any threads yet.
                                </p>
                                <Link href="/thread/create" className="mt-4">
                                    <Button variant="outline">
                                        Create your first thread
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            profile.threads.map((thread) => (
                                <ThreadCard
                                    key={thread.id}
                                    thread={thread}
                                    currentUserId={session?.user?.id}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right spacing */}
                <div className="hidden lg:block w-1/4" />
            </div>
        </main>
    );
}
