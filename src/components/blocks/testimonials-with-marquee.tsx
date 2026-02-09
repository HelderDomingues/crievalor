
import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface TestimonialsSectionProps {
    title: string
    description: string
    testimonials: Array<{
        author: TestimonialAuthor
        text: string
        href?: string
    }>
    className?: string
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className
}: TestimonialsSectionProps) {
    return (
        <section className={cn(
            "bg-[#010816] text-white",
            "py-24 sm:py-32 px-0 relative overflow-hidden",
            className
        )}>
            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mx-auto flex max-w-container flex-col items-center gap-12 text-center sm:gap-16 relative z-10">
                <div className="flex flex-col items-center gap-4 px-4 sm:gap-6">
                    <h2 className="max-w-[720px] text-3xl font-bold tracking-tight sm:text-5xl leading-tight">
                        {title}
                    </h2>
                    <p className="text-md max-w-[600px] text-slate-400 sm:text-xl leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="relative w-full px-4 sm:px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial, i) => (
                                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <TestimonialCard
                                        {...testimonial}
                                        className="max-w-full w-full"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex items-center justify-center gap-4 mt-8">
                            <CarouselPrevious className="static translate-y-0 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
                            <CarouselNext className="static translate-y-0 bg-white/5 border-white/10 hover:bg-white/10 text-white" />
                        </div>
                    </Carousel>

                    {/* Gradient Fades for deep space theme */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#010816] to-transparent sm:block z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#010816] to-transparent sm:block z-10" />
                </div>
            </div>
        </section>
    )
}
