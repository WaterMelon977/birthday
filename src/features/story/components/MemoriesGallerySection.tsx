"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Masonry from "react-masonry-css";
import { GALLERY_IMAGES, AURA_SOLO_1, PARENTS_AURA_1 } from "@/helpers/image-helper";


const ALL_IMAGES = [AURA_SOLO_1, PARENTS_AURA_1, ...GALLERY_IMAGES];

const BREAKPOINTS = {
    default: 3,
    1100: 2,
    700: 1,
};

export default function MemoriesGallerySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);

    const addCard = (el: HTMLDivElement | null, i: number) => {
        if (el) cardRefs.current[i] = el;
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title reveal
            gsap.fromTo(
                titleRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Stagger card reveals
            const cards = cardRefs.current.filter(Boolean);
            gsap.fromTo(
                cards,
                { opacity: 0, y: 60, scale: 0.92 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 75%",
                        end: "center 40%",
                        scrub: 0.5,
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Mouse parallax on hover
    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>,
        el: HTMLDivElement | null
    ) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
            rotateY: cx * 8,
            rotateX: -cy * 8,
            scale: 1.03,
            duration: 0.4,
            ease: "power1.out",
            transformPerspective: 600,
        });
    };

    const handleMouseLeave = (el: HTMLDivElement | null) => {
        if (!el) return;
        gsap.to(el, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
        });
    };

    return (
        <section
            ref={sectionRef}
            className="section-pad"
            style={{
                background:
                    "linear-gradient(180deg, var(--bg-base) 0%, var(--blush) 50%, #fff 100%)",
                position: "relative",
                overflow: "hidden",
            }}
            aria-label="Memories Gallery"
        >
            {/* Decorative blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "5%",
                    right: "5%",
                    width: "35vw",
                    height: "35vw",
                    background:
                        "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                }}
            />

            <div
                ref={titleRef}
                style={{ textAlign: "center", padding: "0 1.5rem 64px", opacity: 0 }}
            >
                <p
                    style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "var(--rose)",
                    }}
                >
                    Every photo tells a story
                </p>
                <h2
                    style={{
                        fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                        color: "var(--mauve-dark)",
                        marginTop: "0.4rem",
                    }}
                >
                    Precious Memories
                </h2>
            </div>

            <div
                ref={gridRef}
                style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
            >
                <Masonry
                    breakpointCols={BREAKPOINTS}
                    className="masonry-grid"
                    columnClassName="masonry-grid-col"
                >
                    {ALL_IMAGES.map((src, i) => (
                        <div
                            key={i}
                            ref={(el) => addCard(el, i)}
                            onMouseMove={(e) => handleMouseMove(e, cardRefs.current[i])}
                            onMouseLeave={() => handleMouseLeave(cardRefs.current[i])}
                            onClick={() => setLightboxSrc(src)}
                            className="oval-frame"
                            style={{
                                position: "relative",
                                marginBottom: "20px",
                                borderRadius: "14px",
                                overflow: "hidden",
                                cursor: "pointer",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                opacity: 0,
                                transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <Image
                                src={src}
                                alt={`Memory ${i + 1}`}
                                width={600}
                                height={800}
                                sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    transition: "transform 0.4s ease",
                                }}
                            />
                            {/* Hover overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(to bottom, transparent 60%, rgba(140,90,115,0.25) 100%)",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                }}
                                className="img-overlay"
                            />
                        </div>
                    ))}
                </Masonry>
            </div>

            {/* Lightbox */}
            {lightboxSrc && (
                <div
                    onClick={() => setLightboxSrc(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.9)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "zoom-out",
                        padding: "2rem",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            borderRadius: "12px",
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            src={lightboxSrc}
                            alt="Full photo"
                            width={1200}
                            height={900}
                            style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                </div>
            )}

            <style>{`
        .masonry-grid { display: flex; gap: 20px; }
        .masonry-grid-col { background-clip: padding-box; }
        .masonry-grid-col > div:hover .img-overlay { opacity: 1; }
      `}</style>
        </section>
    );
}
