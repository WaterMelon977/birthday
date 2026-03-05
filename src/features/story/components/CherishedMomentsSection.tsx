"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    AURA_SOLO_1,
    PARENTS_AURA_1,
    FATHERS_FAMILY_1,
    MOTHERS_FAMILY_1,
} from "@/helpers/image-helper";


const scenes = [
    {
        id: "aura-alone",
        image: AURA_SOLO_1,
        alt: "Aura — our little princess",
        headline: "Our little princess",
        sub: "turns ONE 🎀",
        body: "A whole year of firsts, of wonder, of pure joy.",
        layout: "center" as const,
        accent: "var(--mauve-dark)",
    },
    {
        id: "parents",
        image: PARENTS_AURA_1,
        alt: "Mom, Dad & Aura",
        headline: "Together,",
        sub: "We Are Home",
        body: "The three of us — a family knit from love, laughter and endless sweet moments.",
        layout: "left" as const,
        accent: "var(--plum)",
    },
    {
        id: "fathers-family",
        image: FATHERS_FAMILY_1,
        alt: "Father's family with Aura",
        headline: "Roots &",
        sub: "Strength",
        body: "Your father's family — a circle of warmth and unwavering love.",
        layout: "right" as const,
        accent: "var(--rose)",
    },
    {
        id: "mothers-family",
        image: MOTHERS_FAMILY_1,
        alt: "Mother's family with Aura",
        headline: "Grace &",
        sub: "Tenderness",
        body: "Your mother's family — the softest arms and the warmest hearts.",
        layout: "left" as const,
        accent: "var(--gold)",
    },
];

export default function CherishedMomentsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRefs = useRef<HTMLDivElement[]>([]);
    const imageRefs = useRef<HTMLDivElement[]>([]);
    const textRefs = useRef<HTMLDivElement[]>([]);
    const bgRefs = useRef<HTMLDivElement[]>([]);

    const addScene = (el: HTMLDivElement | null, i: number) => {
        if (el) sceneRefs.current[i] = el;
    };
    const addImage = (el: HTMLDivElement | null, i: number) => {
        if (el) imageRefs.current[i] = el;
    };
    const addText = (el: HTMLDivElement | null, i: number) => {
        if (el) textRefs.current[i] = el;
    };
    const addBg = (el: HTMLDivElement | null, i: number) => {
        if (el) bgRefs.current[i] = el;
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            scenes.forEach((scene, i) => {
                const sceneEl = sceneRefs.current[i];
                const imgEl = imageRefs.current[i];
                const txtEl = textRefs.current[i];
                const bgEl = bgRefs.current[i];

                if (!sceneEl || !imgEl || !txtEl || !bgEl) return;

                // Pin each scene for 280% scroll distance
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sceneEl,
                        start: "top top",
                        end: "+=280%",
                        pin: true,
                        scrub: 1.2,
                        anticipatePin: 1,
                    },
                });

                // Background gradient slow drift
                tl.fromTo(bgEl, { yPercent: 0 }, { yPercent: -12 }, 0);

                // Image parallax + gentle 3D depth
                tl.fromTo(
                    imgEl,
                    {
                        scale: 1.08,
                        yPercent: 4,
                        rotateY: scene.layout === "left" ? 3 : scene.layout === "right" ? -3 : 0,
                        opacity: 0.7,
                    },
                    {
                        scale: 1,
                        yPercent: -8,
                        rotateY: 0,
                        opacity: 1,
                    },
                    0
                );

                // Text choreography
                const textChildren = txtEl.querySelectorAll(".reveal-line");
                tl.fromTo(
                    textChildren,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.15,
                    },
                    0.1
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            aria-label="Cherished Moments"
            ref={containerRef}
            style={{ background: "var(--bg-base)" }}
        >
            {/* Section label */}
            <div
                style={{
                    padding: "80px 1.5rem 60px",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "var(--rose)",
                    }}
                >
                    Cherished Moments
                </p>
                <h2
                    style={{
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        color: "var(--mauve-dark)",
                        marginTop: "0.5rem",
                        textShadow: "0 2px 20px rgba(250,204,21,0.15)",
                    }}
                >
                    The Heart of Our Story
                </h2>
            </div>

            {scenes.map((scene, i) => (
                <div
                    key={scene.id}
                    ref={(el) => addScene(el, i)}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100svh",
                        overflow: "hidden",
                        background: "var(--bg-base)",
                    }}
                >
                    {/* Slow-moving background gradient */}
                    <div
                        ref={(el) => addBg(el, i)}
                        className="perf-layer"
                        style={{
                            position: "absolute",
                            inset: "-15% -10%",
                            background: `radial-gradient(ellipse at 50% 60%, ${scene.accent}22 0%, transparent 70%)`,
                            zIndex: 0,
                        }}
                    />

                    {/* Full-bleed image */}
                    <div
                        ref={(el) => addImage(el, i)}
                        className="perf-layer"
                        style={{
                            position: "absolute",
                            inset: "-6% -5%",
                            zIndex: 1,
                            perspective: "800px",
                        }}
                    >
                        <Image
                            src={scene.image}
                            alt={scene.alt}
                            fill
                            priority={i === 0}
                            sizes="100vw"
                            style={{
                                objectFit: "cover",
                                objectPosition:
                                    scene.layout === "left"
                                        ? "30% center"
                                        : scene.layout === "right"
                                            ? "70% center"
                                            : "center",
                                filter: "contrast(1.05) brightness(0.88)",
                            }}
                        />
                        {/* Gradient vignette */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    scene.layout === "center"
                                        ? "linear-gradient(to bottom, rgba(253,245,246,0) 0%, rgba(253,245,246,0.3) 60%, rgba(253,245,246,1) 100%)"
                                        : scene.layout === "left"
                                            ? "linear-gradient(to right, rgba(253,245,246,0) 0%, rgba(253,245,246,0.4) 55%, rgba(253,245,246,0.95) 100%)"
                                            : "linear-gradient(to left, rgba(253,245,246,0) 0%, rgba(253,245,246,0.4) 55%, rgba(253,245,246,0.95) 100%)",
                            }}
                        />
                    </div>

                    {/* Text overlay */}
                    <div
                        ref={(el) => addText(el, i)}
                        style={{
                            position: "absolute",
                            zIndex: 20,
                            ...(scene.layout === "center"
                                ? {
                                    bottom: "12%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    textAlign: "center",
                                    width: "min(600px, 90vw)",
                                }
                                : scene.layout === "left"
                                    ? {
                                        right: "6%",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        textAlign: "left",
                                        width: "min(420px, 42vw)",
                                    }
                                    : {
                                        left: "6%",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        textAlign: "left",
                                        width: "min(420px, 42vw)",
                                    }),
                        }}
                    >
                        <h2
                            className="reveal-line"
                            style={{
                                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                                color: "var(--mauve-dark)",
                                textShadow: `0 2px 20px rgba(255,255,255,0.6)`,
                                lineHeight: 1.0,
                            }}
                        >
                            {scene.headline}
                        </h2>
                        <h2
                            className="reveal-line"
                            style={{
                                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                                color: scene.accent,
                                textShadow: `0 1px 14px ${scene.accent}55`,
                                lineHeight: 1.1,
                            }}
                        >
                            {scene.sub}
                        </h2>
                        <p
                            className="font-body reveal-line"
                            style={{
                                marginTop: "1.2rem",
                                fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
                                color: "var(--text-body)",
                                lineHeight: 1.75,
                                fontWeight: 400,
                            }}
                        >
                            {scene.body}
                        </p>
                        {/* Gold accent bar */}
                        <div
                            className="reveal-line"
                            style={{
                                marginTop: "1.5rem",
                                height: "2px",
                                width: "60px",
                                background: `linear-gradient(to right, ${scene.accent}, transparent)`,
                                ...(scene.layout === "center"
                                    ? { margin: "1.5rem auto 0" }
                                    : {}),
                            }}
                        />
                    </div>
                </div>
            ))}
        </section>
    );
}
