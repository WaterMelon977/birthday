"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// Add your video filenames to public/videos/
const VIDEOS: { src: string; label: string }[] = [
    // Example: { src: "/videos/aura-first-steps.mp4", label: "First Steps" },
    // Add real files when available; showing placeholder UI for now
    { src: "/videos/clapping.mp4", label: "Joyful Clapping" }
];

export default function VideoTreasuresSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
                }
            );

            if (gridRef.current) {
                gsap.fromTo(
                    gridRef.current.querySelectorAll(".video-card"),
                    { opacity: 0, y: 50, scale: 0.94 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.12,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 75%",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Auto-play/pause video on viewport enter/exit
    const handleVideoRef = (el: HTMLVideoElement | null) => {
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.play().catch(() => { });
                } else {
                    el.pause();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
    };

    return (
        <section
            ref={sectionRef}
            className="section-pad"
            style={{
                background: "var(--bg-base)",
                position: "relative",
                overflow: "hidden",
            }}
            aria-label="Video Treasures"
        >
            <div
                ref={titleRef}
                style={{ textAlign: "center", padding: "0 1.5rem 64px", opacity: 0 }}
            >
                <p
                    style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "var(--plum)",
                    }}
                >
                    Moving memories
                </p>
                <h2
                    style={{
                        fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                        color: "var(--mauve-dark)",
                        marginTop: "0.4rem",
                    }}
                >
                    Video Treasures
                </h2>
            </div>

            <div
                ref={gridRef}
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
                            className="video-card perf-layer"
                            style={{
                                position: "relative",
                                borderRadius: "16px",
                                overflow: "hidden",
                                aspectRatio: "9/16",
                                background: "#fffdfd",
                                border: "1px solid rgba(140, 90, 115, 0.15)",
                                boxShadow: "0 16px 48px rgba(140,90,115,0.08)",
                                opacity: 0,
                            }}
                        >
                            <video
                                ref={handleVideoRef}
                                src={v.src}
                                muted
                                loop
                                playsInline
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "12px 16px",
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#fff",
                                        fontSize: "0.85rem",
                                        letterSpacing: "0.1em",
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
        </section>
    );
}
