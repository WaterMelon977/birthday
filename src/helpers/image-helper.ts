/**
 * image-helper.ts
 * Centralised image constants loaded from public/photos
 * Naming convention: <role>_<number>
 */

// ── Hero / Key Family Photos ─────────────────────────────────────────────────

/** Aura solo – used as Hero and Cherished Moments #1 */
export const AURA_SOLO_1 = "/photos/NSR_5732.JPG";


export const AURA_HERO_LEFT = "/photos/chilling.jpg";
export const AURA_HERO_RIGHT = "/photos/homeshoot.jpg";

export const LETTER_LEFT = "/photos/chilling.jpg";
export const LETTER_RIGHT = "/photos/homeshoot.jpg";

export const ANIM_LEFT = "/photos/anim1.png";
export const ANIM_RIGHT = "/photos/anim2.png";

/** Mom, Dad & Aura – Cherished Moments #2 */
export const PARENTS_AURA_1 = "/photos/NSR_5512.JPG";

/** Father's Family – Cherished Moments #3 */
export const FATHERS_FAMILY_1 = "/photos/NSR_5513.JPG";

/** Mother's Family – Cherished Moments #4 */
export const MOTHERS_FAMILY_1 = "/photos/NSR_5514.JPG";

// ── Aura Over the Years (Growth / Film Reel) ─────────────────────────────────

export const AURA_YEARS_1 = "/photos/NSR_5515.JPG";
export const AURA_YEARS_2 = "/photos/NSR_5516.JPG";
export const AURA_YEARS_3 = "/photos/NSR_5732.JPG";

// ── Memories Gallery (Party / Remaining Photos) ──────────────────────────────

export const MEMORIES_1 = "/photos/NSR_5733.JPG";
export const MEMORIES_2 = "/photos/NSR_5738.JPG";
export const MEMORIES_3 = "/photos/NSR_5739.JPG";

// ── Convenience array for gallery grid ───────────────────────────────────────
// Including ALL photos from the directory to ensure they all work/appear

export const GALLERY_IMAGES = [
    "/photos/NSR_5740.JPG",
    "/photos/NSR_5741.JPG",
    "/photos/NSR_5742.JPG",
    "/photos/banquet.jpg",
    "/photos/guestss.jpg",
    "/photos/stage.jpg",
    "/photos/NSR_5733.JPG",
    "/photos/NSR_5738.JPG",
    "/photos/NSR_5739.JPG",
    "/photos/NSR_5515.JPG",
    "/photos/NSR_5516.JPG",
    "/photos/NSR_5732.JPG",
];

export const FILM_REEL_IMAGES = [
    AURA_YEARS_1,
    AURA_YEARS_2,
    AURA_YEARS_3,
    AURA_SOLO_1,
    ...GALLERY_IMAGES.slice(0, 4)
];
