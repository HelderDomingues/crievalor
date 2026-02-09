
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar: string
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: string
    href?: string
    className?: string
}

export function TestimonialCard({
    author,
    text,
    href,
    className
}: TestimonialCardProps) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href } : {})}
            className={cn(
                "flex flex-col rounded-lg border border-white/5",
                "bg-gradient-to-b from-slate-900/50 to-slate-950/10",
                "p-4 text-start sm:p-6",
                "hover:from-slate-900/60 hover:to-slate-950/20",
                "max-w-[320px] sm:max-w-[320px] shrink-0",
                "transition-colors duration-300",
                className
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarImage src={author.avatar} alt={author.name} />
                </Avatar>
                <div className="flex flex-col items-start text-left">
                    <h3 className="text-md font-semibold leading-none text-white">
                        {author.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {author.handle}
                    </p>
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-slate-400 leading-relaxed">
                {text}
            </p>
        </Card>
    )
}
