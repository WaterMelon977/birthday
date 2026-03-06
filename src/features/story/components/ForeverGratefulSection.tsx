"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AURA_SOLO_1, PARENTS_AURA_1, MEMORIES_1 } from "@/helpers/image-helper";

const STRIP = [AURA_SOLO_1, PARENTS_AURA_1, MEMORIES_1];

export default function ForeverGratefulSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollContentRef.current || !maskRef.current) return;

        const ctx = gsap.context(() => {
            // Initial Title reveal (happens independently of the intense scroll scrubbing)
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

            // Calculate precisely how far the scroll content needs to move
            const getScrollAmt = () => {
                const contentHeight = scrollContentRef.current?.offsetHeight || 0;
                const maskHeight = maskRef.current?.offsetHeight || 0;
                return Math.max(0, contentHeight - maskHeight);
            };

            // Main scrubbed timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    // Increase the 'end' duration significantly so we have plenty of scroll space
                    // to scrub through the y-translation AND the blur/opacity reveals gracefully.
                    end: () => `+=${getScrollAmt() + window.innerHeight * 1.5}`,
                    pin: true,
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                }
            });

            // 1. Move the entire content block up slowly
            tl.to(scrollContentRef.current, {
                y: () => -getScrollAmt(),
                ease: "none",
                duration: 2 // Gives this translation a relative weight in the timeline
            }, 0)

            // 2. Reveal the Body Text with a frosted (blur) effect WHILE it's moving
            if (textRef.current) {
                // Split the paragraphs to stagger them slightly
                const paragraphs = textRef.current.querySelectorAll("p");
                tl.fromTo(
                    paragraphs,
                    { opacity: 0, filter: "blur(12px)", scale: 0.95 },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        stagger: 0.3,
                        ease: "power2.out",
                        duration: 0.8 // Relative duration to the y-translation
                    },
                    0.2 // Start slightly after the scroll translation begins
                );
            }

            // 3. Reveal the Family photo strip with a frosted effect after text
            if (imagesRef.current) {
                const imgs = imagesRef.current.querySelectorAll(".strip-img");
                tl.fromTo(
                    imgs,
                    { opacity: 0, filter: "blur(16px)", scale: 0.85, y: 40 },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        y: 0,
                        stagger: 0.2,
                        ease: "back.out(1.2)",
                        duration: 0.7
                    },
                    1.0 // Start this sequence further into the timeline (after text starts revealing)
                );
            }

            // 4. Reveal divider
            if (dividerRef.current) {
                tl.fromTo(
                    dividerRef.current,
                    { opacity: 0, scaleX: 0 },
                    { opacity: 1, scaleX: 1, ease: "power2.out", duration: 0.4 },
                    "-=0.2"
                );
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden h-screen flex flex-col pt-10 pb-6 md:pt-16 md:pb-12"
            style={{
                background:
                    "linear-gradient(170deg, var(--bg-base) 0%, var(--blush) 40%, var(--bg-base) 100%)",
            }}
            aria-label="Forever Grateful"
        >
            {/* Background petal effect */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: "80vw",
                    height: "80vw",
                    maxWidth: "900px",
                    background:
                        "radial-gradient(circle, rgba(246,174,188,0.2) 0%, rgba(246,174,188,0.05) 40%, transparent 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Guaranteed Title Block - Fixed height and width relative to the section */}
            <div ref={titleRef} className="shrink-0 flex flex-col items-center justify-center opacity-0 z-20 px-4 text-center">
                <p
                    style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "var(--rose)",
                        marginBottom: "1rem",
                    }}
                >
                    With all our love
                </p>
                <h2
                    style={{
                        fontSize: "clamp(3.8rem, 9vw, 8rem)",
                        color: "var(--mauve-dark)",
                        lineHeight: 1.05,
                        textShadow: "0 2px 20px rgba(255,255,255,0.8)",
                    }}
                >
                    Forever Grateful
                </h2>
                <p
                    className="font-heading"
                    style={{
                        fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                        color: "var(--plum)",
                        marginTop: "0.3rem",
                    }}
                >
                    for you, Aura 🌸
                </p>
            </div>

            {/* Exactly 10px Gap Enforced */}
            <div className="shrink-0 h-[10px] md:h-[15px]" />

            {/* Clipping Mask Viewport Container */}
            <div ref={maskRef} className="flex-1 w-full overflow-hidden relative z-10">
                {/* Scrolling Canvas */}
                <div
                    ref={scrollContentRef}
                    className="absolute top-0 left-0 w-full pb-[20vh] flex flex-col items-center justify-start text-center"
                >
                    <div className="w-full max-w-[700px] px-4 pt-8">

                        {/* Body Text */}
                        <div ref={textRef} className="flex flex-col items-center">
                            <p
                                style={{
                                    fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                                    color: "var(--text-body)",
                                    lineHeight: 1.85,
                                    fontWeight: 400,
                                    // Initially hidden/blurred for JS to take over
                                    opacity: 0,
                                    filter: "blur(12px)"
                                }}
                            >
                                A year ago you arrived and turned our quiet world into a symphony of
                                joy. Every morning you wake us with your laughter. Every milestone
                                reminds us how fast these moments pass. We promise to treasure every
                                single one — for the rest of our lives.
                            </p>

                            <p
                                className="font-body"
                                style={{
                                    marginTop: "2rem",
                                    fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                                    color: "var(--mauve-dark)",
                                    fontStyle: "italic",
                                    opacity: 0,
                                    filter: "blur(12px)"
                                }}
                            >
                                "You are our greatest love story."
                            </p>
                        </div>

                        {/* Family photo strip */}
                        <div
                            ref={imagesRef}
                            style={{
                                marginTop: "5rem",
                                display: "flex",
                                justifyContent: "center",
                                gap: "16px",
                                flexWrap: "wrap",
                            }}
                        >
                            {STRIP.map((src, i) => (
                                <div
                                    key={i}
                                    className="strip-img perf-layer oval-frame"
                                    style={{
                                        position: "relative",
                                        width: "clamp(100px, 22vw, 180px)",
                                        aspectRatio: "2/3",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        boxShadow: "0 12px 32px rgba(140,90,115,0.1)",
                                        transform: `rotate(${[-3, 1, -2][i] ?? 0}deg)`,
                                        opacity: 0,
                                        filter: "blur(16px)"
                                    }}
                                >
                                    <Image
                                        src={src}
                                        alt={`Family moment ${i + 1}`}
                                        fill
                                        sizes="180px"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Gold divider */}
                        <div
                            ref={dividerRef}
                            style={{
                                margin: "5rem auto 0",
                                height: "1px",
                                width: "120px",
                                background:
                                    "linear-gradient(to right, transparent, var(--gold), transparent)",
                                opacity: 0,
                                transformOrigin: "center"
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
