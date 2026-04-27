import { Loader2Icon, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: LucideProps) {
    return (
        <output aria-label="Loading" className={cn("inline-flex", className)}>
            <Loader2Icon
                className={cn("size-4 animate-spin", className)}
                {...props}
            />
        </output>
    );
}

export { Spinner };
