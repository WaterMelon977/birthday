"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import confetti from "canvas-confetti";

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [canClickConfetti, setCanClickConfetti] = useState(false);

    const playAudio = () => {
        if (audioRef.current) {
            // Reset time and play to allow for rapid, overlapping pops
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.log("Audio playback prevented by browser:", e));
        }
    };

    useEffect(() => {
        if (!footerRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            let hasFired = false;

            gsap.set(textRef.current!.children, {
                opacity: 0,
                filter: "blur(16px)",
                scale: 0.9,
                y: 50
            });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasFired) {
                            hasFired = true;

                            // 1. Reveal Footer Text
                            gsap.to(textRef.current!.children, {
                                opacity: 1,
                                filter: "blur(0px)",
                                scale: 1,
                                y: 0,
                                stagger: 0.2,
                                ease: "power2.out",
                                duration: 1.2,
                            });

                            // 2. Fire Confetti
                            const duration = 2.5 * 1000;
                            const animationEnd = Date.now() + duration;
                            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

                            function randomInRange(min: number, max: number) {
                                return Math.random() * (max - min) + min;
                            }

                            const interval: any = setInterval(function () {
                                const timeLeft = animationEnd - Date.now();

                                if (timeLeft <= 0) {
                                    setCanClickConfetti(true); // Enable click confetti after initial burst ends
                                    return clearInterval(interval);
                                }

                                const particleCount = 50 * (timeLeft / duration);
                                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                                playAudio();
                            }, 250);
                        }
                    });
                },
                {
                    // Fire when 60% of the footer is visible
                    threshold: 0.6,
                }
            );

            observer.observe(footerRef.current!);

            return () => {
                observer.disconnect();
            };
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const handleFooterClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!canClickConfetti) return;

        // Calculate click coordinates relative to viewport for the confetti origin
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        confetti({
            particleCount: 80,
            spread: 80,
            origin: { x, y },
            zIndex: 100,
            startVelocity: 25,
            colors: ['#facc15', '#f43f5e', '#a855f7', '#3b82f6', '#10b981']
        });

        playAudio();
    };

    return (
        <footer
            ref={footerRef}
            onClick={handleFooterClick}
            className={`flex flex-col items-center justify-center p-6 md:p-12 text-center transition-colors duration-300 ${canClickConfetti ? 'cursor-pointer' : ''}`}
            style={{
                background:
                    "linear-gradient(170deg, var(--bg-base) 0%, var(--blush) 40%, var(--bg-base) 100%)",
                position: "relative",
                zIndex: 1,
                minHeight: "100vh",
                borderTop: "1px solid rgba(140, 90, 115, 0.15)",
                overflow: "hidden",
            }}
        >
            {/* Hidden audio element for the pop sound */}
            <audio ref={audioRef} src="/videos/aud.mp3" preload="auto" />

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

            <div ref={textRef} className="flex flex-col items-center justify-center relative z-10 w-full pointer-events-none">
                <p
                    className="font-heading"
                    style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        color: "var(--mauve-dark)",
                        letterSpacing: "0.05em",
                        opacity: 0,
                        filter: "blur(16px)"
                    }}
                >
                    Happy 1st Birthday, Aura! 🎀✨
                </p>
                <p
                    style={{
                        marginTop: "1rem",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--plum)",
                        opacity: 0,
                        filter: "blur(16px)"
                    }}
                >
                    Made with love · {new Date().getFullYear()}
                </p>

                <p
                    className="mt-8 font-body text-xs tracking-[0.2em] uppercase opacity-0"
                    style={{
                        opacity: canClickConfetti ? 0.6 : 0,
                        color: "var(--mauve-dark)",
                        transition: "opacity 1s ease-in-out",
                    }}
                >
                    Click to celebrate
                </p>
            </div>
        </footer>
    );
}
