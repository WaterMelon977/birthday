"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FILM_REEL_IMAGES } from "@/helpers/image-helper";

gsap.registerPlugin(ScrollTrigger);

/*
  Horizontal film reel experience:
  - Section is PINNED while the track scrolls left
  - Sprocket strips move RIGHT (opposite) at 0.4× speed for parallax depth
  - Styled like real 35 mm cinema film with dark edges and punched holes
*/
const CARD_WIDTH = 340;
const CARD_GAP = 28;
const CARD_STRIDE = CARD_WIDTH + CARD_GAP;

// How many sprocket holes to generate
const HOLE_COUNT = 120;

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

        const totalScroll =
            FILM_REEL_IMAGES.length * CARD_STRIDE - window.innerWidth + CARD_GAP * 2;

        // Parallax ratio: sprockets travel opposite at 40% of the track speed
        const PARALLAX = 0.4;

        const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            onUpdate: (self) => {
                const dx = self.progress * totalScroll;
                // Images go left
                gsap.set(track, { x: -dx });
                // Sprockets go right (opposite direction, slower = parallax)
                gsap.set(topSprockets, { x: dx * PARALLAX });
                gsap.set(bottomSprockets, { x: dx * PARALLAX });
            },
            invalidateOnRefresh: true,
        });

        return () => st.kill();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100svh",
                overflow: "hidden",
                background: "var(--bg-base)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
            aria-label="Aura Over the Years"
        >
            {/* ── Section label ─────────────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    top: "clamp(5rem, 5vh, 4rem)",
                    left: "clamp(1.5rem, 5vw, 5rem)",
                    zIndex: 30,
                }}
            >
                <p
                    style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: "var(--rose)",
                        marginBottom: "0.4rem",
                    }}
                >
                    A journey through time
                </p>
                <h2
                    className="font-heading"
                    style={{
                        fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                        color: "var(--mauve-dark)",
                        lineHeight: 1.0,
                    }}
                >
                    Aura Over the Years
                </h2>
            </div>

            {/* ── TOP FILM STRIP ─────────────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "52px",
                    background: "#ce7a95ff",           /* deep cinematic black-red */
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* Moving sprocket holes */}
                <div
                    ref={topSprocketsRef}
                    style={{
                        display: "flex",
                        gap: "22px",
                        paddingLeft: "12px",
                        willChange: "transform",
                    }}
                >
                    {Array.from({ length: HOLE_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                minWidth: "22px",
                                height: "28px",
                                background: "var(--bg-base)",   /* "punched through" */
                                borderRadius: "4px",
                                flexShrink: 0,
                                opacity: 0.92,
                            }}
                        />
                    ))}
                </div>
                {/* Amber film-edge tint line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background:
                            "linear-gradient(to right, #8b4513, #d4a017, #8b4513, #d4a017)",
                        backgroundSize: "200px 2px",
                        opacity: 0.55,
                    }}
                />
            </div>

            {/* ── BOTTOM FILM STRIP ──────────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "52px",
                    background: "#ce7a95ff",
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={bottomSprocketsRef}
                    style={{
                        display: "flex",
                        gap: "22px",
                        paddingLeft: "12px",
                        willChange: "transform",
                    }}
                >
                    {Array.from({ length: HOLE_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                minWidth: "22px",
                                height: "28px",
                                background: "var(--bg-base)",
                                borderRadius: "4px",
                                flexShrink: 0,
                                opacity: 0.92,
                            }}
                        />
                    ))}
                </div>
                {/* Amber line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background:
                            "linear-gradient(to right, #8b4513, #d4a017, #8b4513, #d4a017)",
                        backgroundSize: "200px 2px",
                        opacity: 0.55,
                    }}
                />
            </div>

            {/* ── IMAGE TRACK ────────────────────────────────────────── */}
            <div
                ref={trackRef}
                style={{
                    display: "flex",
                    gap: `${CARD_GAP}px`,
                    alignItems: "center",
                    paddingLeft: `${CARD_GAP}px`,
                    paddingTop: "52px",
                    paddingBottom: "52px",
                    width: "max-content",
                    willChange: "transform",
                }}
            >
                {FILM_REEL_IMAGES.map((src, i) => (
                    <div
                        key={i}
                        style={{
                            position: "relative",
                            width: `${CARD_WIDTH}px`,
                            flexShrink: 0,
                            borderRadius: "4px",
                            overflow: "hidden",
                            background: "#fff8f9",
                            border: "1px solid rgba(0,0,0,0.1)",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "3/4",
                            }}
                        >
                            <Image
                                src={src}
                                alt={`Memory ${i + 1}`}
                                fill
                                sizes={`${CARD_WIDTH}px`}
                                style={{
                                    objectFit: "cover",
                                    filter: "contrast(1.04) brightness(1.02)",
                                }}
                            />
                        </div>

                        {/* Card footer */}
                        <div
                            style={{
                                padding: "10px 14px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#fff8f9",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.62rem",
                                    color: "var(--text-body)",
                                    opacity: 0.5,
                                    letterSpacing: "0.1em",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.55rem",
                                    color: "var(--rose)",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                }}
                            >
                                ♥ Aura
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right fade — hints more is coming */}
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "100px",
                    background: "linear-gradient(to right, transparent, rgba(253,245,246,0.92))",
                    zIndex: 25,
                    pointerEvents: "none",
                }}
            />
        </section>
    );
}
