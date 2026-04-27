"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations";
import { env } from "@/lib/env";

function LoginForm() {
    const router = useRouter();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: standardSchemaResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        if (!executeRecaptcha) return;
        const token = await executeRecaptcha("login");

        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            fetchOptions: {
                headers: {
                    "x-captcha-response": token,
                },
            },
        });
        if (error) {
            form.setError("root", {
                type: "manual",
                message: error.message || "An error occurred during login",
            });
        } else {
            router.push("/");
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Please enter your credentials to access your account.
                        {form.formState.errors.root && (
                            <p className="text-red-500 mt-2 text-sm">
                                {form.formState.errors.root.message}
                            </p>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="login-form"
                        method="POST"
                    >
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type="email"
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
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type="password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <Field>
                                {form.formState.isSubmitting ? (
                                    <Button disabled size="sm">
                                        <Spinner data-icon="inline-start" />
                                        Loading...
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={!executeRecaptcha}
                                    >
                                        Login
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={async () =>
                                        await authClient.signIn.social({
                                            provider: "google",
                                        })
                                    }
                                >
                                    Login with Google <FaGoogle />
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/auth/register">Register</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        >
            <LoginForm />
        </GoogleReCaptchaProvider>
    );
}
