"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FILM_REEL_IMAGES } from "@/helpers/image-helper";

gsap.registerPlugin(ScrollTrigger);

// How many sprocket holes to generate
// 100 is plenty since we will loop them infinitely
const HOLE_COUNT = 100;

export default function AuraOverTheYearsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const topSprocketsRef = useRef<HTMLDivElement>(null);
    const bottomSprocketsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        const topSprockets = topSprocketsRef.current;
        const bottomSprockets = bottomSprocketsRef.current;
        if (!section || !track || !topSprockets || !bottomSprockets) return;

        // Parallax ratio: sprockets travel opposite at 40% of the track speed
        const PARALLAX = 0.4;

        // Loop dimension for sprockets (22px width + 22px gap)
        const SPROCKET_SIZE = 44;

        const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            onUpdate: (self) => {
                // Determine max scroll width dynamically so it perfectly fits any device
                const totalScroll = track.scrollWidth - window.innerWidth;
                const dx = self.progress * totalScroll;

                // Images go left
                gsap.set(track, { x: -dx });

                // Sprockets go right (opposite direction, slower = parallax)
                // Modulo allows infinite seamless repeat without rendering thousands of holes
                const offset = (dx * PARALLAX) % SPROCKET_SIZE;
                gsap.set(topSprockets, { x: offset });
                gsap.set(bottomSprockets, { x: offset });
            },
            invalidateOnRefresh: true,
        });

        return () => st.kill();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-center bg-[var(--bg-base)]"
            aria-label="Aura Over the Years"
        >
            {/* ── Section label ─────────────────────────────────────── */}
            <div className="absolute top-[clamp(4rem,5vh,5rem)] left-[clamp(1.5rem,5vw,5rem)] z-30">
                <p className="text-[0.65rem] tracking-[0.38em] uppercase text-[var(--rose)] mb-1.5">
                    A journey through time
                </p>
                <h2 className="font-heading text-[clamp(2.1rem,5vw,4.5rem)] text-[var(--mauve-dark)] leading-[1.0]">
                    Aura Over the Years
                </h2>
            </div>

            {/* ── TOP FILM STRIP ─────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 h-[48px] md:h-[52px] bg-[#ce7a95ff] z-20 flex items-center overflow-hidden">
                <div
                    ref={topSprocketsRef}
                    className="flex gap-[22px] -ml-[44px] pl-[12px] will-change-transform"
                >
                    {Array.from({ length: HOLE_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[22px] h-[24px] md:h-[28px] bg-[var(--bg-base)] rounded shrink-0 opacity-90"
                        />
                    ))}
                </div>
                {/* Amber film-edge tint line */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-55"
                    style={{
                        background: "linear-gradient(to right, #8b4513, #d4a017, #8b4513, #d4a017)",
                        backgroundSize: "200px 2px",
                    }}
                />
            </div>

            {/* ── BOTTOM FILM STRIP ──────────────────────────────────── */}
            <div className="absolute bottom-0 left-0 right-0 h-[48px] md:h-[52px] bg-[#ce7a95ff] z-20 flex items-center overflow-hidden">
                <div
                    ref={bottomSprocketsRef}
                    className="flex gap-[22px] -ml-[44px] pl-[12px] will-change-transform"
                >
                    {Array.from({ length: HOLE_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[22px] h-[24px] md:h-[28px] bg-[var(--bg-base)] rounded shrink-0 opacity-90"
                        />
                    ))}
                </div>
                {/* Amber line */}
                <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-55"
                    style={{
                        background: "linear-gradient(to right, #8b4513, #d4a017, #8b4513, #d4a017)",
                        backgroundSize: "200px 2px",
                    }}
                />
            </div>

            {/* ── IMAGE TRACK ────────────────────────────────────────── */}
            <div
                ref={trackRef}
                className="flex items-center gap-[1rem] sm:gap-[1.5rem] md:gap-[1.75rem] pl-[1.5rem] md:pl-[3rem] pr-[20vw] py-[52px] w-max will-change-transform"
            >
                {FILM_REEL_IMAGES.map((src, i) => (
                    <div
                        key={i}
                        className="relative shrink-0 rounded-[4px] overflow-hidden bg-[#fff8f9] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.12)] w-[70vw] sm:w-[50vw] md:w-[340px]"
                    >
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src={src}
                                alt={`Memory ${i + 1}`}
                                fill
                                sizes="(max-width: 768px) 70vw, (max-width: 1024px) 50vw, 340px"
                                style={{
                                    objectFit: "cover",
                                    filter: "contrast(1.04) brightness(1.02)",
                                }}
                            />
                        </div>

                        {/* Card footer */}
                        <div className="px-3 md:px-[14px] py-2 md:py-[12px] flex justify-between items-center bg-[#fff8f9]">
                            <span className="font-mono text-[0.55rem] md:text-[0.62rem] text-[var(--text-body)] opacity-50 tracking-widest">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="font-mono text-[0.5rem] md:text-[0.55rem] text-[var(--rose)] tracking-[0.15em] uppercase">
                                ♥ Aura
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right fade — hints more is coming */}
            <div
                className="absolute right-0 top-0 bottom-0 w-[60px] md:w-[100px] pointer-events-none z-[25]"
                style={{
                    background: "linear-gradient(to right, transparent, rgba(253,245,246,0.92))",
                }}
            />
        </section>
    );
}
