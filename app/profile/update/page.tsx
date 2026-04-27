"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import type z from "zod";
import Loading from "@/app/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileAction } from "@/lib/actions/user";
import { authClient } from "@/lib/auth-client";
import { updateProfileSchema } from "@/lib/validations";

export default function EditProfilePage() {
    const router = useRouter();
    const { data, isPending, error } = authClient.useSession();
    const [state, action, pending] = useActionState(updateProfileAction, null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Assuming you will pre-fill these with the current user's data
    // when fetching from your database or auth context.
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: standardSchemaResolver(updateProfileSchema),
        // Using `values` instead of `defaultValues` ensures the form
        // resets with the user's data once the session finishes loading.
        values: {
            name: data?.user?.name || "",
            bio: data?.user?.bio || "",
            image: data?.user?.image,
        },
    });

    if (isPending) return <Loading />;
    if (!data) return router.push("/auth/login");
    if (error?.message) return <h1>{error.message}</h1>;

    function onSubmit(data: z.infer<typeof updateProfileSchema>) {
        startTransition(() => {
            action(data);
        });
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
                            Edit Profile
                        </h1>
                    </header>

                    <div className="p-6">
                        <p className="text-sm text-muted-foreground mb-6">
                            Update your personal details and public profile.
                            {state?.error && (
                                <span className="text-red-500 mt-2 block">
                                    {state.error}
                                </span>
                            )}
                        </p>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            id="edit-profile-form"
                            method="POST"
                        >
                            <FieldGroup>
                                <Controller
                                    name="image"
                                    control={form.control}
                                    render={({
                                        field: {
                                            value,
                                            onChange,
                                            ...fieldProps
                                        },
                                        fieldState,
                                    }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                            className="flex flex-col items-center mb-4"
                                        >
                                            <label
                                                htmlFor="avatar-upload"
                                                className="relative group w-fit rounded-full overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 block"
                                                aria-label="Change Profile Image"
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                                    className="sr-only"
                                                    id="avatar-upload"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file) {
                                                            onChange(file);
                                                            setPreviewUrl(
                                                                URL.createObjectURL(
                                                                    file,
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                    {...fieldProps}
                                                />
                                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl group-hover:opacity-75 transition-opacity">
                                                    <AvatarImage
                                                        src={
                                                            previewUrl ||
                                                            (typeof value ===
                                                            "string"
                                                                ? value
                                                                : undefined)
                                                        }
                                                        alt={
                                                            data?.user?.name ||
                                                            "Avatar"
                                                        }
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="text-2xl font-semibold">
                                                        {data?.user?.name
                                                            ?.substring(0, 2)
                                                            .toUpperCase() ||
                                                            "NA"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                                                    Edit Image
                                                </div>
                                            </label>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                    className="mt-2"
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Display Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value || ""} // fallback to "" for nullable values
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                autoComplete="off"
                                                type="text"
                                                placeholder="John Doe"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="bio"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Bio
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""} // fallback to "" for nullable values
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Tell us a little bit about yourself..."
                                                className="resize-none"
                                                rows={4}
                                            />
                                            <FieldDescription>
                                                Maximum 160 characters.
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                {pending ? (
                                    <Button disabled>
                                        <Spinner data-icon="inline-start" />
                                        Saving...
                                    </Button>
                                ) : (
                                    <Button type="submit">Save Changes</Button>
                                )}
                            </FieldGroup>
                        </form>
                    </div>
                </div>

                {/* Right spacing */}
                <div className="hidden lg:block w-1/4" />
            </div>
        </main>
    );
}
