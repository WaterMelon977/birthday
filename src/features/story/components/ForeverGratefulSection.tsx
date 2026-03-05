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
    const bodyRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    end: "center 30%",
                    scrub: 0.6,
                },
            });

            tl.fromTo(
                titleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1 }
            )
                .fromTo(
                    bodyRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1 },
                    "-=0.4"
                )
                .fromTo(
                    stripRef.current?.querySelectorAll(".strip-img") ?? [],
                    { y: 40, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, stagger: 0.1 },
                    "-=0.3"
                );

            // Footer reveal
            gsap.fromTo(
                footerRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-pad"
            style={{
                background:
                    "linear-gradient(170deg, var(--bg-base) 0%, var(--blush) 40%, var(--bg-base) 100%)",
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
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

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: "700px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                }}
            >
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

                <div ref={titleRef} style={{ opacity: 0 }}>
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

                <div ref={bodyRef} style={{ opacity: 0 }}>
                    <p
                        style={{
                            marginTop: "2.5rem",
                            fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                            color: "var(--text-body)",
                            lineHeight: 1.85,
                            fontWeight: 400,
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
                        }}
                    >
                        "You are our greatest love story."
                    </p>
                </div>

                {/* Family photo strip */}
                <div
                    ref={stripRef}
                    style={{
                        marginTop: "4rem",
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
                    style={{
                        margin: "4rem auto 0",
                        height: "1px",
                        width: "120px",
                        background:
                            "linear-gradient(to right, transparent, var(--gold), transparent)",
                    }}
                />
            </div>

            {/* Footer */}
            <footer
                ref={footerRef}
                style={{
                    position: "relative",
                    zIndex: 1,
                    marginTop: "5rem",
                    paddingBottom: "3rem",
                    opacity: 0,
                }}
            >
                <p
                    className="font-heading"
                    style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        color: "var(--mauve-dark)",
                        letterSpacing: "0.05em",
                    }}
                >
                    Happy 1st Birthday, Aura! 🎀✨
                </p>
                <p
                    style={{
                        marginTop: "0.75rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--text-body)",
                    }}
                >
                    Made with love · {new Date().getFullYear()}
                </p>
            </footer>
        </section>
    );
}
