"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_IMAGES, AURA_SOLO_1, PARENTS_AURA_1 } from "@/helpers/image-helper";

gsap.registerPlugin(ScrollTrigger);

const ALL_IMAGES = [AURA_SOLO_1, PARENTS_AURA_1, ...GALLERY_IMAGES];

export default function MemoriesGallerySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);

    const addCard = (el: HTMLDivElement | null, i: number) => {
        if (el) cardRefs.current[i] = el;
    };

    useEffect(() => {
        if (!gridRef.current || !maskRef.current) return;

        const ctx = gsap.context(() => {
            // Initial Title reveal animation
            gsap.fromTo(
                titleRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            // Calculate exactly how far we need to translate the grid upwards
            const getScrollAmt = () => {
                const gridHeight = gridRef.current?.offsetHeight || 0;
                const maskHeight = maskRef.current?.offsetHeight || 0;
                // Don't scroll if we have fewer images than fit on screen
                return Math.max(0, gridHeight - maskHeight);
            };

            const anim = gsap.to(gridRef.current, {
                y: () => -getScrollAmt(),
                ease: "none"
            });

            // Pin the entire 100vh section, driving the internal grid movement with scrub
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollAmt()}`,
                pin: true,
                animation: anim,
                scrub: 1.5, // 1.5 seconds of smoothing to make the scroll incredibly buttery
                invalidateOnRefresh: true, // Recalculate precisely if window resizes
            });

        }, sectionRef);

        // We use IntersectionObserver strictly bound to the clipping mask container 
        // to detect when images "scroll" into the viewport box to fade them in.
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(entry.target, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "power2.out",
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: maskRef.current,
                rootMargin: "0px 0px 50px 0px", // Trigger slightly pre-emptive fading
                threshold: 0.05,
            }
        );

        cardRefs.current.forEach((card) => {
            if (card) {
                // Initial fade states
                gsap.set(card, { opacity: 0, y: 100, scale: 0.92 });
                observer.observe(card);
            }
        });

        return () => {
            ctx.revert();
            observer.disconnect();
        };
    }, []);

    // Mouse parallax on hover
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
            rotateY: cx * 8,
            rotateX: -cy * 8,
            scale: 1.03,
            duration: 0.4,
            ease: "power1.out",
            transformPerspective: 600,
        });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        gsap.to(el, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
        });
    };

    return (
        <section
            ref={sectionRef}
            // Uses flex-col with h-screen so we can explicitly section off the title and mask grid vertically
            className="relative w-full overflow-hidden h-screen flex flex-col pt-10 pb-6 md:pt-16 md:pb-12"
            style={{
                background:
                    "linear-gradient(180deg, var(--bg-base) 0%, var(--blush) 50%, #fff 100%)",
            }}
            aria-label="Memories Gallery"
        >
            {/* Decorative background blob */}
            <div
                className="absolute top-[5%] right-[5%] w-[80vw] md:w-[35vw] h-[80vw] md:h-[35vw] rounded-full pointer-events-none z-0"
                style={{
                    background:
                        "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)",
                }}
            />

            {/* Guaranteed Title Block - Fixed height and width relative to the section */}
            <div ref={titleRef} className="shrink-0 flex flex-col items-center justify-center opacity-0 z-20 px-4">
                <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.35em] uppercase text-[var(--rose)] mb-2 md:mb-4">
                    Every photo tells a story
                </p>
                <h2 className="font-heading text-[clamp(2.3rem,5vw,4.5rem)] text-[var(--mauve-dark)] leading-[1.1] drop-shadow-sm">
                    Precious Memories
                </h2>
            </div>

            {/* Absolute fixed 10px visual gap to strictly enforce the user requirement */}
            <div className="shrink-0 h-[10px] md:h-[15px]" />

            {/* Clipping Mask Viewport Container - Fills the exact remaining height of the screen */}
            {/* Because overflow is hidden, any images translating upward are clipped EXACTLY here, 
                meaning it's mathematically impossible for them to cross the gap or invade the title text. */}
            <div ref={maskRef} className="flex-1 w-full overflow-hidden relative z-10">

                {/* Rolling Content Canvas that GSAP scrolls vertically */}
                <div ref={gridRef} className="absolute top-0 left-0 w-full pb-[15vh] flex justify-center">
                    <div className="w-full max-w-[1200px] px-4 sm:px-6">
                        {/* 
                            Native CSS Masonry layout flawlessly handling columns
                        */}
                        <div className="columns-2 md:columns-3 gap-4 md:gap-6 lg:gap-8">
                            {ALL_IMAGES.map((src, i) => (
                                <div
                                    key={i}
                                    ref={(el) => addCard(el, i)}
                                    className="break-inside-avoid relative mb-4 md:mb-6 lg:mb-8 opacity-0"
                                >
                                    <div
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => setLightboxSrc(src)}
                                        className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                                        style={{
                                            transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Memory ${i + 1}`}
                                            width={600}
                                            height={800}
                                            sizes="(max-width:640px) 50vw, 33vw"
                                            className="w-full h-auto block transition-transform duration-400 ease-out group-hover:scale-105"
                                        />
                                        {/* Hover overlay masking */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-white/30 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 mix-blend-multiply"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxSrc && (
                <div
                    onClick={() => setLightboxSrc(null)}
                    className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center cursor-zoom-out p-4 md:p-8"
                >
                    <div className="relative max-w-[95vw] md:max-w-[90vw] max-h-[95vh] md:max-h-[90vh] rounded-xl overflow-hidden shadow-2xl">
                        <Image
                            src={lightboxSrc}
                            alt="Full photo"
                            width={1200}
                            height={900}
                            className="w-auto h-auto max-w-[95vw] md:max-w-[90vw] max-h-[95vh] md:max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
