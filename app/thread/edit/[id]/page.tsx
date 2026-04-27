import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/database";
import { threads } from "@/database/schema";
import { auth } from "@/lib/auth";
import { validIdSchema } from "@/lib/validations";
import EditThreadForm from "./edit-form";

export default async function EditThreadPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const isIdValid = validIdSchema.safeParse(id);

    if (!isIdValid.success) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const thread = await db.query.threads.findFirst({
        where: eq(threads.id, id),
    });

    if (!thread || thread.authorId !== session?.user.id) {
        notFound();
    }

    return (
        <EditThreadForm threadId={thread.id} initialContent={thread.content} />
    );
}
