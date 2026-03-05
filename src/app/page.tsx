import { Suspense, lazy } from "react";

// Eager-load Hero for instant LCP
import HeroSection from "@/features/story/components/HeroSection";

// Lazy-load remaining heavy sections
const StoryBeginsSection = lazy(
  () => import("@/features/story/components/StoryBeginsSection")
);
const CherishedMomentsSection = lazy(
  () => import("@/features/story/components/CherishedMomentsSection")
);
const AuraOverTheYearsSection = lazy(
  () => import("@/features/story/components/AuraOverTheYearsSection")
);
const MemoriesGallerySection = lazy(
  () => import("@/features/story/components/MemoriesGallerySection")
);
const VideoTreasuresSection = lazy(
  () => import("@/features/story/components/VideoTreasuresSection")
);
const ForeverGratefulSection = lazy(
  () => import("@/features/story/components/ForeverGratefulSection")
);

function SectionLoader() {
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--warm)",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "2px solid rgba(250,204,21,0.2)",
          borderTop: "2px solid #facc15",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. The Story Begins */}
      <Suspense fallback={<SectionLoader />}>
        <StoryBeginsSection />
      </Suspense>

      {/* 3. Cherished Moments — Premium Pinned Cinematic */}
      <Suspense fallback={<SectionLoader />}>
        <CherishedMomentsSection />
      </Suspense>

      {/* 4. Aura Over the Years — Film Reel */}
      <Suspense fallback={<SectionLoader />}>
        <AuraOverTheYearsSection />
      </Suspense>

      {/* 5. Memories Gallery */}
      <Suspense fallback={<SectionLoader />}>
        <MemoriesGallerySection />
      </Suspense>

      {/* 6. Video Treasures */}
      <Suspense fallback={<SectionLoader />}>
        <VideoTreasuresSection />
      </Suspense>

      {/* 7. Forever Grateful */}
      <Suspense fallback={<SectionLoader />}>
        <ForeverGratefulSection />
      </Suspense>
    </main>
  );
}
