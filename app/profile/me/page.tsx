import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { ThreadCard } from "@/components/thread-card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { threads } from "@/database/schema";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/login");
    }

    const userThreads = await db.query.threads.findMany({
        where: eq(threads.authorId, session.user.id),
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

    const joinDate = new Date(session.user.createdAt).toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        },
    );

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto flex justify-center px-0 sm:px-4">
                {/* Left spacing */}
                <div className="hidden lg:block w-1/4" />

                {/* Center content */}
                <div className="w-full max-w-2xl border-x border-muted/30 min-h-screen bg-card/20">
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-muted/30 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Go back"
                                >
                                    <FaArrowLeft />
                                </Button>
                            </Link>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                                Profile
                            </h1>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Log out</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Sign out
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to sign out of
                                        your account?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <form
                                        action={async () => {
                                            "use server";
                                            await auth.api.signOut({
                                                headers: await headers(),
                                            });
                                            redirect("/auth/login");
                                        }}
                                    >
                                        <AlertDialogAction type="submit">
                                            Log out
                                        </AlertDialogAction>
                                    </form>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </header>

                    <div className="p-6">
                        <div className="flex flex-col items-center sm:items-start gap-4">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarImage
                                    src={session.user.image || undefined}
                                    alt={session.user.name}
                                />
                                <AvatarFallback className="text-2xl">
                                    {session.user.name
                                        .substring(0, 2)
                                        .toUpperCase() || "NA"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 text-center sm:text-left flex-1">
                                <h2 className="text-2xl font-bold">
                                    {session.user.name}
                                </h2>
                                <p className="text-muted-foreground">
                                    {session.user.bio || "No bio yet"}
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mt-2">
                                    <FaCalendar />
                                    <span>Joined {joinDate}</span>
                                </div>
                            </div>
                            <Link href="/profile/update">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 sm:mt-0"
                                >
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="flex flex-col">
                                <span className="font-bold">
                                    {userThreads.length}
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
                            <h3 className="font-semibold">Your Threads</h3>
                        </div>
                        {userThreads.length === 0 ? (
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
                            userThreads.map((thread) => (
                                <ThreadCard
                                    key={thread.id}
                                    thread={thread}
                                    currentUserId={session.user.id}
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
