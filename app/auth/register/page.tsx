"use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import type z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import {
//     Field,
//     FieldDescription,
//     FieldError,
//     FieldGroup,
//     FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { authClient } from "@/lib/auth-client";
// import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
// import { registerSchema } from "@/lib/validations";

export default function LoginPage() {
    // const [error, setError] = useState("");
    // const router = useRouter();
    // const form = useForm<z.infer<typeof registerSchema>>({
    //     resolver: standardSchemaResolver(registerSchema),
    //     defaultValues: {
    //         name: "",
    //         email: "",
    //         password: "",
    //     },
    // });

    // async function onSubmit(data: z.infer<typeof registerSchema>) {
    //     const { error } = await authClient.signUp.email({
    //         email: data.email,
    //         password: data.password,
    //         name: data.name,
    //     });
    //     if (error) {
    //         setError(error.message || "An error occurred during registration");
    //     } else {
    //         router.push("/auth/login");
    //     }
    // }

    return (
        <div className="min-h-screen flex justify-center items-center">
            Not available for now
        </div>
    );

    // return (
    //     <div className="min-h-screen flex justify-center items-center">
    //         <Card className="w-full sm:max-w-md">
    //             <CardHeader>
    //                 <CardTitle>Create an Account</CardTitle>
    //                 <CardDescription>
    //                     Please enter your details to create an account.
    //                     {error && (
    //                         <p className="text-red-500 mt-2 text-sm">{error}</p>
    //                     )}
    //                 </CardDescription>
    //             </CardHeader>
    //             <CardContent>
    //                 <form
    //                     onSubmit={form.handleSubmit(onSubmit)}
    //                     id="login-form"
    //                 >
    //                     <FieldGroup>
    //                         <Controller
    //                             name="name"
    //                             control={form.control}
    //                             render={({ field, fieldState }) => (
    //                                 <Field data-invalid={fieldState.invalid}>
    //                                     <FieldLabel htmlFor={field.name}>
    //                                         Name
    //                                     </FieldLabel>
    //                                     <Input
    //                                         {...field}
    //                                         id={field.name}
    //                                         aria-invalid={fieldState.invalid}
    //                                         autoComplete="off"
    //                                         type="text"
    //                                     />
    //                                     {fieldState.invalid && (
    //                                         <FieldError
    //                                             errors={[fieldState.error]}
    //                                         />
    //                                     )}
    //                                 </Field>
    //                             )}
    //                         />
    //                         <Controller
    //                             name="email"
    //                             control={form.control}
    //                             render={({ field, fieldState }) => (
    //                                 <Field data-invalid={fieldState.invalid}>
    //                                     <FieldLabel htmlFor={field.name}>
    //                                         Email
    //                                     </FieldLabel>
    //                                     <Input
    //                                         {...field}
    //                                         id={field.name}
    //                                         aria-invalid={fieldState.invalid}
    //                                         autoComplete="off"
    //                                         type="email"
    //                                     />
    //                                     {fieldState.invalid && (
    //                                         <FieldError
    //                                             errors={[fieldState.error]}
    //                                         />
    //                                     )}
    //                                 </Field>
    //                             )}
    //                         />
    //                         <Controller
    //                             name="password"
    //                             control={form.control}
    //                             render={({ field, fieldState }) => (
    //                                 <Field data-invalid={fieldState.invalid}>
    //                                     <FieldLabel htmlFor={field.name}>
    //                                         Password
    //                                     </FieldLabel>
    //                                     <Input
    //                                         {...field}
    //                                         id={field.name}
    //                                         aria-invalid={fieldState.invalid}
    //                                         autoComplete="off"
    //                                         type="password"
    //                                     />
    //                                     {fieldState.invalid && (
    //                                         <FieldError
    //                                             errors={[fieldState.error]}
    //                                         />
    //                                     )}
    //                                 </Field>
    //                             )}
    //                         />
    //                         <Field>
    //                             <Button type="submit">Create Account</Button>
    //                             <FieldDescription className="text-center">
    //                                 Already have an account?{" "}
    //                                 <Link href="/auth/login">Login</Link>
    //                             </FieldDescription>
    //                         </Field>
    //                     </FieldGroup>
    //                 </form>
    //             </CardContent>
    //         </Card>
    //     </div>
    // );
}
