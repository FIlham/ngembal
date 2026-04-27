"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { FaArrowLeft } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createThreadAction } from "@/lib/actions/threads";

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();

    return pending ? (
        <Button disabled size="sm">
            <Spinner data-icon="inline-start" />
            Loading...
        </Button>
    ) : (
        <Button type="submit" disabled={disabled}>
            Post
        </Button>
    );
}

export default function CreateThreadPage() {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | undefined>();

    const trimmedLength = content.trim().length;
    const remaining = 1000 - content.length;
    const isDisabled = trimmedLength === 0 || content.length > 1000;

    async function formAction(formData: FormData) {
        setError(undefined);
        const result = await createThreadAction(formData);

        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto flex justify-center px-0 sm:px-4">
                {/* Left spacing */}
                <div className="hidden lg:block w-1/4" />

                {/* Center content */}
                <div className="w-full max-w-2xl border-x border-muted/30 min-h-screen bg-card/20">
                    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-muted/30 p-4 flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <FaArrowLeft />
                        </Button>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                            New post
                        </h1>
                    </header>

                    <div className="p-6">
                        <p className="text-sm text-muted-foreground mb-6">
                            Keep it concise and easy to read. You can post up to
                            1000 characters.
                        </p>
                        <form action={formAction} className="space-y-5">
                            <FieldGroup>
                                <Field>
                                    <Textarea
                                        name="content"
                                        placeholder="What do you want to talk about?"
                                        value={content}
                                        onChange={(event) =>
                                            setContent(event.target.value)
                                        }
                                        maxLength={1000}
                                        className="min-h-40 rounded-2xl border-border/70 bg-background/70 px-4 py-3 text-sm shadow-none"
                                        aria-invalid={
                                            Boolean(error) ||
                                            content.length > 1000
                                        }
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <FieldDescription>
                                            Write naturally. Short posts usually
                                            feel better to read.
                                        </FieldDescription>
                                        <span
                                            className={
                                                remaining < 120
                                                    ? "text-sm font-medium text-foreground"
                                                    : "text-sm text-muted-foreground"
                                            }
                                        >
                                            {remaining} left
                                        </span>
                                    </div>
                                    <FieldError>
                                        {content.length > 1000
                                            ? "Content too long"
                                            : error}
                                    </FieldError>
                                </Field>
                            </FieldGroup>

                            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                                <p className="text-sm text-muted-foreground">
                                    {trimmedLength === 0
                                        ? "Start typing to enable posting."
                                        : `${trimmedLength} character${trimmedLength === 1 ? "" : "s"} ready to post.`}
                                </p>
                                <SubmitButton disabled={isDisabled} />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right spacing */}
                <div className="hidden lg:block w-1/4" />
            </div>
        </main>
    );
}
