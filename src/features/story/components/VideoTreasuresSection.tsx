"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// Add your video filenames to public/videos/
const VIDEOS: { src: string; label: string }[] = [
    // Example: { src: "/videos/aura-first-steps.mp4", label: "First Steps" },
    // Add real files when available; showing placeholder UI for now
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" },
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" },
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" },
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" },
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" }
];

export default function VideoTreasuresSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<HTMLVideoElement[]>([]);

    const addVideo = (el: HTMLVideoElement | null, i: number) => {
        if (el) videoRefs.current[i] = el;
    };

    useEffect(() => {
        if (!gridRef.current || !maskRef.current) return;

        const ctx = gsap.context(() => {
            // Title reveal
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

            // Calculate scroll distance for the grid
            const getScrollAmt = () => {
                const gridHeight = gridRef.current?.offsetHeight || 0;
                const maskHeight = maskRef.current?.offsetHeight || 0;
                return Math.max(0, gridHeight - maskHeight);
            };

            const anim = gsap.to(gridRef.current, {
                y: () => -getScrollAmt(),
                ease: "none"
            });

            // Pin section and scrub grid
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollAmt()}`,
                pin: true,
                animation: anim,
                scrub: 1.5,
                invalidateOnRefresh: true,
            });

        }, sectionRef);

        // Observer for fading in cards
        const cardObserver = new IntersectionObserver(
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
                        cardObserver.unobserve(entry.target);
                    }
                });
            },
            {
                root: maskRef.current,
                rootMargin: "0px 0px 50px 0px",
                threshold: 0.05,
            }
        );

        // Observer specifically for playing/pausing the active video
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            {
                root: maskRef.current,
                // Only consider the video "active" when it reaches 45% visibility
                // This ensures only one video is typically playing at a time
                threshold: 0.45,
            }
        );

        // Attach cards and videos to observers
        const cards = gridRef.current.querySelectorAll(".video-card");
        cards.forEach((card, i) => {
            gsap.set(card, { opacity: 0, y: 100, scale: 0.92 });
            cardObserver.observe(card);
        });

        videoRefs.current.forEach((video) => {
            if (video) videoObserver.observe(video);
        });

        return () => {
            ctx.revert();
            cardObserver.disconnect();
            videoObserver.disconnect();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden h-screen flex flex-col pt-10 pb-6 md:pt-16 md:pb-12"
            style={{
                background: "var(--bg-base)",
            }}
            aria-label="Video Treasures"
        >
            {/* Title Block Fixed relative to container */}
            <div
                ref={titleRef}
                className="shrink-0 flex flex-col items-center justify-center opacity-0 z-20 px-4"
            >
                <p className="text-[0.65rem] md:text-[0.7rem] tracking-[0.35em] uppercase text-[var(--plum)] mb-2 md:mb-4">
                    Moving memories
                </p>
                <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--mauve-dark)] leading-[1.1] drop-shadow-sm">
                    Video Treasures
                </h2>
            </div>

            {/* Exactly 10px Gap Enforced */}
            <div className="shrink-0 h-[10px] md:h-[15px]" />

            {/* The Clipping Mask Viewport */}
            <div ref={maskRef} className="flex-1 w-full overflow-hidden relative z-10">
                <div ref={gridRef} className="absolute top-0 left-0 right-0 w-full pb-[15vh]">
                    <div
                        style={{
                            maxWidth: "1100px",
                            margin: "0 auto",
                            padding: "0 1.5rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "28px",
                        }}
                    >
                        {VIDEOS.length > 0 ? (
                            VIDEOS.map((v, i) => (
                                <div
                                    key={i}
                                    className="video-card perf-layer group"
                                    style={{
                                        position: "relative",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        aspectRatio: "9/16",
                                        background: "#fffdfd",
                                        border: "1px solid rgba(140, 90, 115, 0.15)",
                                        boxShadow: "0 16px 48px rgba(140,90,115,0.08)",
                                    }}
                                >
                                    <video
                                        ref={(el) => addVideo(el, i)}
                                        src={v.src}
                                        muted
                                        loop
                                        playsInline
                                        className="transition-transform duration-700 ease-out group-hover:scale-105"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            padding: "24px 16px 16px",
                                            background:
                                                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#fff",
                                                fontSize: "0.85rem",
                                                letterSpacing: "0.1em",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {v.label}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Placeholder when no videos yet */
                            <div
                                style={{
                                    gridColumn: "1/-1",
                                    textAlign: "center",
                                    padding: "80px 1.5rem",
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "1rem",
                                        color: "var(--rose)",
                                    }}
                                >
                                    <svg
                                        width="64"
                                        height="64"
                                        viewBox="0 0 64 64"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <circle cx="32" cy="32" r="28" />
                                        <polygon points="26,22 26,42 46,32" fill="currentColor" stroke="none" />
                                    </svg>
                                    <p style={{ fontSize: "0.9rem", letterSpacing: "0.15em" }}>
                                        Place your videos in{" "}
                                        <code style={{ color: "var(--mauve-dark)" }}>public/videos/</code> and add
                                        them to the VIDEOS array
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
