"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIM_LEFT, ANIM_RIGHT } from "@/helpers/image-helper";


const LINES = [
    "From the very first moment we held you,",
    "we knew our world had changed forever.",
    "Every smile you gave us was a gift,",
    "every laugh — a memory we treasure.",
    "You are our greatest adventure, our deepest joy.",
    "Happy first birthday, our little Aura. 🌸",
];

export default function StoryBeginsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const linesRef = useRef<HTMLSpanElement[]>([]);
    const imageLeftRef = useRef<HTMLDivElement>(null);
    const imageRightRef = useRef<HTMLDivElement>(null);

    const addLineRef = (el: HTMLSpanElement | null, i: number) => {
        if (el) linesRef.current[i] = el;
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Create a single pinned timeline for the entire sequence
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 1.2, // smoother scrub
                    anticipatePin: 1,
                },
            });

            // 1. Extreme dramatic entry for both images
            tl.fromTo(
                imageLeftRef.current,
                { x: "-60vw", y: 200, opacity: 0, rotate: -45, scale: 0.6 },
                { x: 0, y: 0, opacity: 1, rotate: -4, scale: 1, ease: "power3.out" },
                0 // starts at the very beginning of the pin
            );

            tl.fromTo(
                imageRightRef.current,
                { x: "60vw", y: -200, opacity: 0, rotate: 45, scale: 0.6 },
                { x: 0, y: 0, opacity: 1, rotate: 4, scale: 1, ease: "power3.out" },
                0 // starts at the same time
            );

            // 2. Deep staggered blooming effect for the text lines (Frosted Reveal)
            tl.fromTo(
                linesRef.current,
                { opacity: 0, filter: "blur(12px)", scale: 0.95 },
                { opacity: 1, filter: "blur(0px)", scale: 1, stagger: 0.3, ease: "power2.out", duration: 0.8 },
                0.2 // starts slightly after the images begin swooping in
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-pad relative overflow-hidden flex items-center justify-center min-h-[100svh]"
            style={{
                background: "linear-gradient(160deg, var(--bg-base) 0%, var(--blush) 55%, #fff 100%)",
            }}
            aria-label="The Story Begins"
        >
            {/* Background glow */}
            <div
                className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] md:w-[60vw] h-[90vw] md:h-[60vw] rounded-full pointer-events-none z-0"
                style={{
                    background: "radial-gradient(circle, rgba(246,174,188,0.15) 0%, transparent 70%)",
                }}
            />

            <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-16 items-center justify-center z-10 py-12 md:py-0">
                {/* Left accent image */}
                <div
                    ref={imageLeftRef}
                    className="relative w-[55%] max-w-[220px] md:w-full md:max-w-none aspect-[3/4] rounded-2xl overflow-hidden opacity-0 self-start md:self-auto ml-2 sm:ml-8 md:ml-0"
                >
                    <Image
                        src={ANIM_LEFT}
                        alt="A cherished memory"
                        fill
                        sizes="(max-width: 768px) 55vw, 33vw"
                        style={{ objectFit: "cover" }}
                    />
                    {/* Soft rose overlay */}
                    <div className="absolute inset-0 bg-[#f6aebc] mix-blend-multiply opacity-5" />
                </div>

                {/* Centre text */}
                <div className="flex flex-col gap-3 relative z-10 text-center my-6 md:my-0">
                    <p className="font-serif text-[0.65rem] sm:text-xs md:text-[0.85rem] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[var(--mauve-dark)] mb-2 md:mb-4">
                        A letter from the heart
                    </p>

                    {LINES.map((line, i) => (
                        <span
                            key={i}
                            ref={(el) => addLineRef(el, i)}
                            className="block text-[1rem] sm:text-[1.15rem] md:text-[1.3rem] lg:text-[1.4rem] font-serif text-[var(--text-body)] leading-relaxed opacity-0 drop-shadow-sm md:drop-shadow-none"
                        >
                            {line}
                        </span>
                    ))}
                </div>

                {/* Right accent image */}
                <div
                    ref={imageRightRef}
                    className="relative w-[55%] max-w-[220px] md:w-full md:max-w-none aspect-[3/4] rounded-2xl overflow-hidden opacity-0 self-end md:self-auto mr-2 sm:mr-8 md:mr-0"
                >
                    <Image
                        src={ANIM_RIGHT}
                        alt="Aura smiling"
                        fill
                        sizes="(max-width: 768px) 55vw, 33vw"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                </div>
            </div>
        </section>
    );
}
