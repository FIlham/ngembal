"use client";

import { ArrowUp, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    createCommentAction,
    toggleLikeAction,
} from "@/lib/actions/interactions";
import { deleteThreadAction } from "@/lib/actions/threads";
import { cn, formatDate } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ThreadCardProps {
    thread: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            name: string;
            image: string | null;
            id: string;
        };
        likes: { userId: string }[];
        comments: {
            id: string;
            content: string;
            createdAt: Date;
            author: {
                name: string;
                image: string | null;
            };
        }[];
    };
    currentUserId?: string;
}

export function ThreadCard({ thread, currentUserId }: ThreadCardProps) {
    const initialLiked = thread.likes.some(
        (like) => like.userId === currentUserId,
    );
    const [liked, setLiked] = React.useState(initialLiked);
    const [likeCount, setLikeCount] = React.useState(thread.likes.length);
    const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const [commentText, setCommentText] = React.useState("");
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLike = () => {
        if (!currentUserId) return;
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
        startTransition(async () => {
            await toggleLikeAction(thread.id);
        });
    };

    const toggleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUserId || isPending) return;

        startTransition(async () => {
            await createCommentAction(thread.id, commentText);
            setCommentText("");
        });
    };

    if (!isMounted) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-4 sm:p-6 opacity-0">
                    <div className="h-24" />
                </CardContent>
                <Separator className="opacity-50" />
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-none bg-transparent w-full">
            <CardContent className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                            <AvatarImage src={thread.author.image ?? ""} />
                            <AvatarFallback>
                                {thread.author.name
                                    .substring(0, 2)
                                    .toUpperCase() || "NA"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-0.5 grow bg-muted/50 rounded-full" />
                    </div>

                    <div className="flex flex-col gap-1.5 grow min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate">
                                <Link
                                    href={`/profile/${thread.author.id}`}
                                    className="font-bold text-sm sm:text-[15px] hover:underline cursor-pointer truncate"
                                >
                                    {thread.author.name}
                                </Link>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    •
                                </span>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {formatDate(thread.createdAt)}
                                </span>
                            </div>
                            {currentUserId === thread.author.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground shrink-0"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/thread/edit/${thread.id}`}
                                                >
                                                    <FaEdit size={"16"} />{" "}
                                                    Update
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={async () =>
                                                    deleteThreadAction(
                                                        thread.id,
                                                    )
                                                }
                                            >
                                                <FaTrash size={"16"} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <p className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words">
                            {thread.content}
                        </p>

                        <div className="flex items-center gap-6 mt-3">
                            <button
                                type="button"
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm transition-all active:scale-90",
                                    liked
                                        ? "text-red-500"
                                        : "text-muted-foreground hover:text-red-500",
                                )}
                            >
                                <Heart
                                    className={cn(
                                        "h-5 w-5",
                                        liked && "fill-current",
                                    )}
                                />
                                <span className="tabular-nums">
                                    {likeCount}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={toggleComments}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm transition-all active:scale-90",
                                    isCommentsOpen
                                        ? "text-blue-500"
                                        : "text-muted-foreground hover:text-blue-500",
                                )}
                            >
                                <MessageCircle
                                    className={cn(
                                        "h-5 w-5",
                                        isCommentsOpen && "fill-current",
                                    )}
                                />
                                <span>{thread.comments.length}</span>
                            </button>
                        </div>

                        <Accordion
                            type="single"
                            collapsible
                            value={isCommentsOpen ? "comments" : ""}
                            className="w-full"
                        >
                            <AccordionItem
                                value="comments"
                                className="border-none"
                            >
                                <AccordionContent className="pb-0 pt-4">
                                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                        {thread.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex gap-3"
                                            >
                                                <Avatar className="h-7 w-7 shrink-0">
                                                    <AvatarImage
                                                        src={
                                                            comment.author
                                                                .image ?? ""
                                                        }
                                                    />
                                                    <AvatarFallback className="text-[10px] bg-muted">
                                                        {comment.author.name
                                                            .substring(0, 2)
                                                            .toUpperCase() ||
                                                            "NA"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col gap-0.5 bg-muted/30 rounded-2xl px-3 py-2 grow">
                                                    <span className="text-[13px] font-bold">
                                                        {comment.author.name}
                                                    </span>
                                                    <p className="text-[13px] text-foreground/90 leading-normal">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {thread.comments.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No comments yet. Be the first to
                                                reply!
                                            </p>
                                        )}
                                    </div>
                                    {currentUserId && (
                                        <div className="mt-4 border-t border-border/50 pt-4 pb-2">
                                            <form
                                                onSubmit={handleCommentSubmit}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Write a reply..."
                                                    value={commentText}
                                                    onChange={(e) =>
                                                        setCommentText(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                                                    disabled={isPending}
                                                />
                                                <Button
                                                    type="submit"
                                                    size="default"
                                                    variant="ghost"
                                                    disabled={
                                                        !commentText.trim() ||
                                                        isPending
                                                    }
                                                    className="text-blue-500 hover:text-blue-600 font-semibold"
                                                >
                                                    <ArrowUp
                                                        className={cn(
                                                            "h-4 w-4",
                                                        )}
                                                    />
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </CardContent>
            <Separator className="opacity-40" />
        </Card>
    );
}
