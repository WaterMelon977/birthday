"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AURA_SOLO_1, AURA_HERO_LEFT, AURA_HERO_RIGHT } from "@/helpers/image-helper";

gsap.registerPlugin(ScrollTrigger);

/*
  Scroll experience:
  - Section is PINNED for 300vh of scroll distance.
  - Progress 0→0.1  : scroll cue fades out
  - Progress 0.1→0.6: left & right images slide in from sides
  - Progress 0.4→1.0: center text fades + rises in
  - Background dims slightly as content appears
*/
export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLDivElement>(null);
    const leftImageRef = useRef<HTMLDivElement>(null);
    const rightImageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const scrollCueRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hard-set initial invisible states BEFORE ScrollTrigger initialises
        gsap.set(leftImageRef.current, { x: "-110vw", opacity: 0, rotate: -6 });
        gsap.set(rightImageRef.current, { x: "110vw", opacity: 0, rotate: 6 });
        // contentRef is always visible; .reveal-line children are set to invisible in the text reveal block below
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        gsap.set(mainImageRef.current, { scale: 1, filter: "brightness(1)" });
        gsap.set(scrollCueRef.current, { opacity: 1, y: 0 });

        // The pinned scroll distance – 350vh worth
        const PIN_DISTANCE = "350%";

        // ── Scroll cue fade (0% → 10%) ──────────────────────────────
        gsap.to(scrollCueRef.current, {
            opacity: 0,
            y: 24,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${window.innerHeight * 0.35}`,   // 10% of 350vh approx
                scrub: true,
                pin: false,
            },
        });

        // ── Main background dim (10% → 60%) ─────────────────────────
        gsap.to(mainImageRef.current, {
            scale: 1.08,
            filter: "brightness(0.72)",
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: `+=${window.innerHeight * 0.35}`,
                end: `+=${window.innerHeight * 2.1}`,
                scrub: true,
                pin: false,
            },
        });

        // ── Left image slide in (10% → 60%) ─────────────────────────
        gsap.to(leftImageRef.current, {
            x: 0,
            opacity: 1,
            rotate: -4,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: `+=${window.innerHeight * 0.35}`,
                end: `+=${window.innerHeight * 2.1}`,
                scrub: true,
                pin: false,
            },
        });

        // ── Right image slide in (10% → 60%) ────────────────────────
        gsap.to(rightImageRef.current, {
            x: 0,
            opacity: 1,
            rotate: 4,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: `+=${window.innerHeight * 0.35}`,
                end: `+=${window.innerHeight * 2.1}`,
                scrub: true,
                pin: false,
            },
        });

        // ── Center text reveal (40% → 85%) ─────────────────────────
        // Ends at 3.0*vh; pin holds to 3.5*vh = guaranteed read window
        // Animate the individual .reveal-line children with stagger,
        // exactly like CherishedMomentsSection does
        const revealLines = contentRef.current?.querySelectorAll(".reveal-line");
        gsap.set(revealLines ?? [], { y: 50, opacity: 0 });
        gsap.set(contentRef.current, { opacity: 1, y: 0 }); // parent always visible, children animate
        gsap.to(revealLines ?? [], {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: `+=${window.innerHeight * 1.4}`,
                end: `+=${window.innerHeight * 3.0}`,
                scrub: true,
                pin: false,
            },
        });


        // ── Pin the section for 350vh ────────────────────────────────
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${PIN_DISTANCE}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
        });

        // ── Scroll cue idle bounce (CSS-style, no ScrollTrigger) ────
        const cueAnim = gsap.to(scrollCueRef.current, {
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "power1.inOut",
            paused: false,
        });

        return () => {
            cueAnim.kill();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        // containerRef is the ScrollTrigger trigger/pin target
        <div ref={containerRef} className="relative w-full" style={{ overflow: "hidden" }}>
            <section
                className="relative w-full flex items-center justify-center"
                style={{ height: "100svh" }}
                aria-label="Hero — Aura's First Birthday"
            >
                {/* ── Full-bleed background image ───────────────────────── */}
                <div ref={mainImageRef} className="absolute inset-0 z-0">
                    <Image
                        src={AURA_SOLO_1}
                        alt="Aura — our little princess"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    {/* Dense vignette — bright from 30% downward so text is always legible */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(253,245,246,0) 0%, rgba(253,245,246,0.3) 30%, rgba(253,245,246,0.85) 65%, #fdf5f6 100%)",
                        }}
                    />
                </div>

                {/* ── Left side image ───────────────────────────────────── */}
                <div
                    ref={leftImageRef}
                    className="absolute z-10 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        left: "6%",
                        top: "52%",
                        transform: "translateY(-50%)",
                        width: "clamp(160px, 22vw, 320px)",
                        aspectRatio: "3/4",
                    }}
                >
                    <Image
                        src={AURA_HERO_LEFT}
                        alt="Aura chilling"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* ── Right side image ──────────────────────────────────── */}
                <div
                    ref={rightImageRef}
                    className="absolute z-10 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        right: "6%",
                        top: "52%",
                        transform: "translateY(-50%)",
                        width: "clamp(160px, 22vw, 320px)",
                        aspectRatio: "3/4",
                    }}
                >
                    <Image
                        src={AURA_HERO_RIGHT}
                        alt="Aura homeshoot"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* ── Center text ── absolute-bottom, sitting on the bright vignette */}
                <div
                    ref={contentRef}
                    className="absolute z-20 text-center pointer-events-none"
                    style={{
                        bottom: "12%",
                        // left: "50%",
                        // transform: "translateX(-50%)",
                        width: "min(600px, 90vw)",
                    }}
                >
                    <h2
                        className="font-heading reveal-line"
                        style={{
                            fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                            color: "var(--mauve-dark)",
                            textShadow: `0 2px 20px rgba(255,255,255,0.6)`,
                            lineHeight: 1.0,
                        }}
                    >
                        Our little Butterfly
                    </h2>
                    <h2
                        className="font-heading reveal-line"
                        style={{
                            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                            color: "var(--rose)",
                            textShadow: `0 1px 14px var(--rose)55`,
                            lineHeight: 1.1,
                        }}
                    >
                        turned one!
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
                        One year of pure magic
                    </p>
                    {/* Accent bar */}
                    <div
                        className="reveal-line"
                        style={{
                            marginTop: "1.5rem",
                            height: "2px",
                            width: "60px",
                            background: `linear-gradient(to right, var(--rose), transparent)`,
                            margin: "1.5rem auto 0",
                        }}
                    />
                </div>

                {/* ── Scroll cue ────────────────────────────────────────── */}
                <div
                    ref={scrollCueRef}
                    className="absolute z-30 flex flex-col items-center gap-3"
                    style={{ bottom: "2.5rem", left: "50%", transform: "translateX(-50%)" }}
                >
                    <span
                        style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.28em",
                            color: "var(--text-body)",
                            textTransform: "uppercase",
                            opacity: 0.7,
                        }}
                    >
                        Scroll to begin
                    </span>
                    <div
                        style={{
                            width: 1,
                            height: 40,
                            background:
                                "linear-gradient(to bottom, var(--mauve-dark), transparent)",
                            opacity: 0.5,
                        }}
                    />
                </div>
            </section>
        </div>
    );
}
