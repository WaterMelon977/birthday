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
                {
                    x: 10,
                    y: 0,
                    opacity: 1,
                    rotate: -4,
                    scale: 1,
                    ease: "power3.out",
                },
                0 // starts at the very beginning of the pin
            );

            tl.fromTo(
                imageRightRef.current,
                { x: "60vw", y: -200, opacity: 0, rotate: 45, scale: 0.6 },
                {
                    x: 80,
                    y: 0,
                    opacity: 1,
                    rotate: 4,
                    scale: 1,
                    ease: "power3.out",
                },
                0 // starts at the same time
            );

            // 2. Deep staggered blooming effect for the text lines
            tl.fromTo(
                linesRef.current,
                { opacity: 0, y: 120, scale: 0.85, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    stagger: 0.25,
                    ease: "power2.out",
                },
                0.2 // starts slightly after the images begin swooping in
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-pad relative overflow-hidden flex items-center justify-center"
            style={{
                background:
                    "linear-gradient(160deg, var(--bg-base) 0%, var(--blush) 55%, #fff 100%)",
                minHeight: "100svh",
            }}
            aria-label="The Story Begins"
        >
            {/* Background glow */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60vw",
                    height: "60vw",
                    background: "radial-gradient(circle, rgba(246,174,188,0.15) 0%, transparent 70%)", // soft rose glow
                    pointerEvents: "none",
                    borderRadius: "50%",
                    zIndex: 0,
                }}
            />

            <div
                className="relative"
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "4rem",
                    alignItems: "center",
                    zIndex: 1,
                }}
            >
                {/* Left accent image */}
                <div
                    ref={imageLeftRef}
                    className=""
                    style={{
                        position: "relative",
                        aspectRatio: "3/4",
                        borderRadius: "16px",
                        overflow: "hidden",
                        // boxShadow: "0 24px 64px rgba(140,90,115,0.08)",
                        opacity: 0,
                    }}
                >
                    <Image
                        src={ANIM_LEFT}
                        alt="A cherished memory"
                        fill
                        sizes="25vw"
                        style={{ objectFit: "cover" }}
                    />
                    {/* Soft rose overlay */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(246,174,188,0.05)",
                            mixBlendMode: "multiply",
                        }}
                    />
                </div>

                {/* Centre text */}
                <div
                    style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        gridRow: "1",
                        gridColumnStart: "2",
                        gridColumnEnd: "3",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                    }}
                >
                    <p
                        className="font-serif"
                        style={{
                            fontSize: "clamp(0.7rem, 1vw, 0.85rem)",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "var(--mauve-dark)",
                            marginBottom: "1rem",
                        }}
                    >
                        A letter from the heart
                    </p>

                    {LINES.map((line, i) => (
                        <span
                            key={i}
                            ref={(el) => addLineRef(el, i)}
                            style={{
                                display: "block",
                                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                                fontFamily: "var(--font-serif)",
                                color: "var(--text-body)",
                                lineHeight: 1.6,
                                opacity: 0,
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </div>

                {/* Right accent image */}
                <div
                    ref={imageRightRef}
                    className=""
                    style={{
                        position: "relative",
                        aspectRatio: "3/4",
                        borderRadius: "16px",
                        overflow: "hidden",
                        // boxShadow: "0 24px 64px rgba(140,90,115,0.08)",
                        opacity: 0,
                    }}
                >
                    <Image
                        src={ANIM_RIGHT}
                        alt="Aura smiling"
                        fill
                        sizes="25vw"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                </div>
            </div>
        </section>
    );
}
