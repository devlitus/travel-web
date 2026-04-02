# Design System Strategy: The Elevated Voyager

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Curated Horizon."** 

In an industry often cluttered with loud "Book Now" buttons and frantic grids, this system takes an editorial approach to travel. It treats every screen like a high-end travel monograph. We move beyond the "template" look by utilizing intentional asymmetry—placing hero imagery slightly off-center and allowing typography to bleed into whitespace—creating a sense of motion and discovery. The experience should feel less like a utility and more like a concierge service: quiet, confident, and deeply premium.

## 2. Colors: Tonal Atmosphere
The palette is rooted in a "High-Light" spectrum. We use deep teals (`primary`) and refined golds (`secondary`) not as fillers, but as precise points of interest against a sprawling landscape of whites and greys.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. In this system, boundaries are felt, not seen. Define sections solely through background shifts:
*   Transition from `surface` (#f9f9f9) to `surface_container_low` (#f3f3f3) to denote a change in content context.
*   Use `surface_container_highest` (#e2e2e2) only for the most critical utility zones (like a search bar anchor).

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine stationery. 
*   **Base:** `surface`
*   **Sectioning:** `surface_container_low`
*   **Floating Elements:** `surface_container_lowest` (#ffffff)
By nesting a `#ffffff` card inside a `#f3f3f3` section, we achieve a "natural lift" that feels architectural rather than digital.

### Signature Textures
Main CTAs must move away from flat hex codes. Apply a subtle linear gradient from `primary` (#00352c) to `primary_container` (#024e41) at a 135-degree angle. This adds a "silk-finish" depth that signals premium quality.

---

## 3. Typography: The Editorial Voice
We pair the authority of a high-contrast serif with the modern clarity of a geometric sans-serif.

*   **Display & Headlines (`notoSerif`):** These are our "statements." Use `display-lg` (3.5rem) with generous letter-spacing for destination names. The serif evokes history, luxury, and trust.
*   **Body & Titles (`manrope`):** Manrope provides the "functional" layer. It is highly legible and modern. Use `body-lg` (1rem) for descriptions to maintain a sense of "breathability."
*   **Labeling:** Always use `label-md` or `sm` in all-caps with 5% letter-spacing when paired with `secondary` (gold) tokens to denote "Luxury Status" or "Premium Tier" tags.

---

## 4. Elevation & Depth: Ambient Light
We reject the heavy drop-shadows of the early web. Our depth is environmental.

*   **The Layering Principle:** Avoid shadows on standard cards. Use the difference between `surface_container_low` and `surface_container_lowest` to create separation.
*   **Ambient Shadows:** For "floating" elements like navigation bars or modal prompts, use a shadow with a blur of `24px` and an opacity of `4%`. The shadow color should be a tinted version of `on_surface` (#1a1c1c), never pure black.
*   **The "Ghost Border" Fallback:** If a container sits on an image and needs definition, use a 1px border using `outline_variant` at **15% opacity**. It should be a whisper of a line, barely perceptible.
*   **Glassmorphism:** Use `surface_container_lowest` with a 70% opacity and a `20px` backdrop-blur for mobile navigation overlays. This allows the vibrant travel imagery to bleed through, maintaining the "serene" personality.

---

## 5. Components: The Primitive Set

### Buttons
*   **Primary:** Gradient (Teal), `md` (0.375rem) roundedness. No border.
*   **Secondary:** Ghost style. `outline` token at 20% opacity. Text in `primary`.
*   **Tertiary:** Text-only in `primary` with a 1px underline using the `secondary_fixed` (gold) token.

### Cards & Lists
*   **The Card Rule:** Forbid divider lines. Use `spacing-8` (2.75rem) to separate card groups. 
*   **Image Handling:** Images within cards should use `md` (0.375rem) corners to feel integrated but soft.

### Input Fields
*   **Style:** Minimalist underline. Only the bottom border is visible using `outline_variant`. On focus, the border transitions to `primary` (teal) and expands to 2px.
*   **Background:** Always `surface_container_lowest` (#ffffff).

### Travel-Specific Components
*   **The Itinerary Timeline:** Do not use a solid vertical line. Use a series of `primary_fixed` dots connected by "empty space" to emphasize the "breathable" nature of the trip.
*   **The Floating Search Anchor:** A high-elevation `surface_container_lowest` bar with a subtle `secondary` (gold) accent on the "Search" icon.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but allow imagery to span 60% of the right-side viewport.
*   **Use Whitespace as a Tool:** If a section feels "crowded," double the spacing token (e.g., move from `spacing-8` to `spacing-16`).
*   **Tone-on-Tone:** Use `on_surface_variant` for secondary text to reduce visual noise.

### Don't:
*   **No "Hard" Borders:** Never use a 100% opaque border to separate content blocks.
*   **No Pure Black:** Use `on_background` (#1a1c1c) for text to keep the contrast "soft" and professional.
*   **No Standard Grids:** Avoid the "3-column card row" whenever possible. Try a 2/3 and 1/3 split to create an editorial, high-end magazine feel.
*   **No Vibrant Errors:** Even error states should be sophisticated. Use `error_container` for backgrounds to keep the "serene" palette intact even when something goes wrong.

---

**Director's Final Note:** 
This system succeeds when it feels like a quiet gallery. Every element must have a reason to exist. If a border or a shadow doesn't add to the "serenity," remove it. Let the typography and the imagery do the heavy lifting.