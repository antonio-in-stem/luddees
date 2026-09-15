# Luddies Visual System v2

Status: product-owner candidate, implemented for visual review. It is not recorded as user-approved yet.

## Product brief

Luddies is a full-stack marketplace for ready-to-use STEM teaching assets, initially focused on educators, schools, families, and creators in Mexico and Latin America. The primary commercial action is finding a useful resource in the catalog; the secondary action is contacting Luddies to publish content or form an institutional partnership.

This pass changes presentation, not product scope. It preserves Bootstrap, vanilla HTML/CSS/JS, the Spring Boot API, the information architecture, and the existing ES/EN localization mechanism. Renders never claim unavailable functionality or contain translated marketing copy.

## Direction: the tactile learning workshop

The identity starts from the project's own logo and legacy palette, not from the bright green/blue treatment that had drifted into the interface. The twin upward loops become character ears, learning-path arcs, and the new minimal white mark. Slate, cherry, rose, and lavender remain the visual world, but v2 uses dark ink fields and brighter cherry moments to create contrast instead of keeping every surface equally calm. Matte paper and restrained felt connect the digital marketplace to materials that a teacher can actually touch and use.

### BRAND-01

The primary symbol is a reduced Luddie face rather than a crop of a full character render. One upright ear, one bent ear, two large eyes, and a small smile remain legible from favicon scale through navigation use. The asymmetry is the ownable memory hook. The white knockout is used on slate or cherry surfaces; the color avatar uses a slate rounded square, antique-rose character, warm-paper eyes, and ink features. Props, felt texture, cards, gradients, letters, and tiny details never enter the core mark.

The intended tension is deliberate: capable enough for educators and institutions, warm enough for learners. The characters support the product; they do not turn the marketplace into a children's game.

Render scale is a defining compositional device. Primary character renders should be materially oversized, allowed to crop or break a section boundary, and occupy roughly 40–55% of a desktop composition when they carry the narrative. Small isolated mascots are reserved for utility moments. The page should feel art-directed around the characters, not decorated with character stickers.

Character renders must resolve into the section whose action or explanation they support. The four-step organization explainer uses an object-only mechanism strip so the product taxonomy, rather than a mascot, carries the meaning. PROCESS-01 remains attached to the final creator CTA, where Lumo and the resource path support the registration action.

### Reference route

- Primary, observed: the Luddies logo variants and palette in `client/images/brand/`. Adopted: twin-loop motif, rounded geometry, slate/cherry/lavender colors. This is project evidence.
- Complementary, adapted: Nintendo Japan's image-led consumer grids and generous reading rhythm, from the bundled community reconstruction. Adopted only as a structural principle. Japanese typography and Nintendo red are discarded.
- Complementary, adapted: Duolingo's use of a mascot as an active product character and tactile interaction cues, from the bundled community reconstruction and source index. Exact green/blue colors, chunky shadows everywhere, lesson-tree gamification, and Duo-like anatomy are discarded.
- Rejected route: Stripe's restrained fintech geometry and lightweight display typography. It improves perceived precision but conflicts with Luddies' educational warmth and existing rounded mark.

The external documents above are research inputs, not official manuals and not authorities over this project.

## Identity invariants

### Color roles

| Role | Token | Value |
|---|---|---|
| Ink | `--text-main` | `#27273D` |
| Slate / navigation / secondary action | `--brand-secondary` | `#565676` |
| Cherry / render accent | `--brand-cherry` | `#A76571` |
| Accessible cherry / primary action | `--brand-primary` | `#9A5966` |
| Antique rose / warm accent | `--brand-pink` | `#C38D94` |
| Pale lilac / character and surface accent | `--brand-purple` | `#AEADF0` |
| Light lavender / quiet highlight | `--brand-accent` | `#D8DCFF` |
| Warm paper / page | `--bg-body` | `#F7F3EE` |
| Surface | `--bg-surface` | `#FFFDF9` |

The home hero may use the ink range `#202035` to `#3F3F69` as a deep stage. Brighter cherry `#C85C72` is restricted to high-emphasis calls to action on that stage; it is not a replacement for the accessible core action token across the app.

Green, cyan, neon, and rainbow palettes are not part of the identity. A muted natural green is allowed only when the subject requires a plant specimen.

The action cherry is a darker UI derivative of the logo cherry. White on `#9A5966` measures 5.26:1; the source `#A76571` remains available for non-text visual accents and renders.

### Type, geometry, and depth

- Nunito remains the main licensed web choice because its rounded terminals fit the mark and already works across the app. Weight 900 is reserved for display and decisive controls; reading copy stays between 600 and 700.
- Surfaces use 16–24 px radii. Circular pills are limited to compact filters, language controls, and metadata.
- Depth is shallow and slate-tinted. Product renders carry physical contact shadows; UI surfaces use one controlled shadow level. Objects do not float without support.
- Dotted arcs may echo a learning path or the logo loops. They remain low contrast and never become generic confetti.

## Character family CHR-01

The characters are original companions derived from the logo's paired loops:

- Lumo: medium, slate, two upright ears, observant.
- Miga: short, antique rose, one bent ear, inventive.
- Nilo: tall, pale lilac with slate cuffs, collaborative.

Shared anatomy is fixed: compact pear torso, exactly two long rounded ears, two arms, two short legs, oval eyes with small dark pupils, a tiny mouth, no nose, and mitten-like hands. Props and actions may change with the lesson; anatomy, relative height, base color, eye construction, and ear posture may not.

Material is finely grained molded paper with short felt only on ears and cuffs. The family is not plush, glossy plastic, a fuzzy bean monster, or an imitation of a known entertainment mascot.

## Composition grammar

- Narrative character renders are foreground objects, never clipped backgrounds. Their stage and every ancestor between the render and section edge must allow visible overflow; the render should cross at least one container boundary while its source-canvas crop aligns deliberately with a section or viewport edge.
- A colored panel may keep its radius and background, but it may not use overflow clipping to contain a Luddie. Text remains above the art layer and viewport-level horizontal clipping prevents accidental page scroll.
- Render backgrounds are transparent when the asset is meant to break out of a section. A seamless raster background is reserved for legitimate product covers.
- The page owns the atmosphere through CSS; the render owns characters, teaching objects, attached shadows, and nothing else.
- Primary scenes use one connected silhouette with overlap and foreground/midground hierarchy. A lineup of equally scaled characters is not a hero composition.
- Cropping is deliberate at the viewport edge, never at a face, decisive teaching object, or character identity cue.
- Each page region gets a role-specific composition. Repeating the same group render in hero, CTA, and process sections is prohibited.
- On desktop, the hero image can exceed its nominal Bootstrap column but cannot cross the copy safe line. On mobile, words remain unbroken and art stacks after the action.

## Render grammar

All families share warm off-white environments, a large soft light from upper-left, a faint cool-lavender rim from the right, short contact shadows, controlled contrast, and the fixed palette. Camera language is a three-quarter, slightly elevated editorial product view with no extreme perspective or dramatic depth of field.

### HERO-02

The hero explains the marketplace through an oversized open teaching portfolio held by Nilo and Miga. The transparent group is scaled and cropped by CSS over a dark ink stage, so it has no visible image boundary. Desktop composition protects the full copy and CTA zone. Titles and calls to action remain live HTML.

The stage is intentionally flat ink, not a purple light mesh: no grid, orbit rings, radial glow, or oversized watermark. A soft elliptical alpha mask dissolves the render at its source-canvas edges while preserving faces and the portfolio, so the scene reads as one editorial composition instead of a rectangular generated image placed on top of the page.

### ORGANIZATION-01

The four-step taxonomy is a connected tabletop machine: a subject compass, a topic selector, a finished lesson folio, and a reinforcement-output track. Each station has a distinct silhouette but shares one physical paper rail, camera, material, and light. The panoramic render aligns with four columns on desktop; on narrow screens the same alpha-verified master is sliced into one large object crop per step. Characters, labels, numbers, and UI are prohibited inside this raster.

### PROCESS-01

Lumo moves blank resource cards from an open folder toward a sequence of geometric learning pieces inside the final creator CTA. This remains a character-led invitation and is visually separate from the object-only organization explainer.

### CTA-01

Miga carries blank resource cards and a bridge piece in an active forward pose. The vertical transparent cutout deliberately breaks the upper and lower bounds of the cherry partnership panel.

### AUTH-01

The authentication scene frames the live login or registration card with the three Luddies peeking from behind it. Their gaze converges on the form, making the welcome feel intentional without arrows, confetti, glow, or rendered interface elements. The central negative space remains transparent so labels, validation, localization, and controls stay real HTML.

The card always owns the interaction layer; the companion render ignores pointer events and may crop at the viewport edges, but never across a face or over a field. Login and registration share the same scene to establish recognition, with scale and vertical space adapted to each form and to mobile.

### VALUE-01

Homepage value propositions use miniature tactile scenes instead of font icons. Each scene combines one concrete teaching object with an active Luddie: a shared schoolhouse, a folded Latin America map, and a four-slot resource organizer. The three emblems share camera, material, light, scale, transparent background, and object-bound shadow, while their silhouette and action remain specific to the idea they explain.

These are supporting illustrations rather than standalone decoration. They break the top edge of each value card, remain hidden from assistive technology because the adjacent heading carries the meaning, and never contain essential labels or localized copy.

### METRIC-01

Catalog metrics use live HTML numerals mounted on tactile counting tokens rendered in CSS. The shared token combines a warm-paper face, shallow colored edge, asymmetric Luddie ear tabs, and object-bound depth; category-specific pieces suggest resource cards, science specimens, hierarchy steps, or paired language tiles.

Numbers are never rasterized. This keeps catalog totals selectable, accessible, and replaceable without regenerating artwork while giving them the same physical presence as the raster scenes. Decorative pieces are excluded from the accessibility tree.

### COVER-01

Square covers prioritize the teaching resource, not the mascot. The portfolio and lesson cards form the repeated visual anchor; the subject-specific kit and a small character cameo provide variation. Covers reserve the top-left corner for an HTML badge and must remain legible at 240 px.

Approved candidate subjects in this pass: science experiments, geometry/bridge building, and inclusive visual routines.

### TEAM-ROOM-01

The team section is a single living-room gallery wall rather than an auto-scrolling card rail. The eight original photographs remain ordinary HTML images so no generative process can reinterpret a face, pose, expression, or body. Mixed frame proportions accommodate the portrait, square, and landscape sources; a shared warm grade, picture rail, mats, plaques, shadows, and wall light make them read as one environment.

Approved transparent Luddies derivatives reappear as small inhabitants along the console. They create interaction and continuity without covering a teammate's face or replacing the people with a synthetic group photograph. On mobile the wall becomes a deliberate one-column family album while retaining the same room and live localized biographies.

## Localization contract: ES / EN / FR

- No essential words, prices, badges, equations, or instructions are rendered into images.
- Raster composition reserves zones for live HTML. Copy can expand without regenerating the art.
- Alt text belongs to the i18n dictionary and describes function, not decorative style.
- French is added as another dictionary/route in the existing i18n layer when localization work is authorized; it does not require a third image set.
- A language-specific image is allowed only when the visible teaching artifact itself must demonstrate that language. Such assets form a localized derivative, never the master.

## Decisions and limits

- The old fuzzy-character renders remain in the repository for provenance but are no longer the default home/catalog imagery.
- The generated character sheet is the current visual anchor. Prompt-only consistency is not considered sufficient.
- Checkerboard-backed generation attempts were rejected and remain outside the project. Only files whose alpha channel was checked programmatically entered the asset manifest.
- These are generative raster images, not editable 3D scenes. No seed or cross-model determinism is claimed.
- Desktop composition was inspected at 1265 px and the complete page was reviewed as a full-page render. Mobile title wrapping was corrected at 390 px. A dedicated mobile hero asset remains optional because the transparent master can be composed independently in CSS.

## Acceptance gates for the next iteration

- A new cover must match both accepted cover anchors in camera, light, material, palette, product ratio, and safe zone.
- Character anatomy and color identity must survive at least two new actions without drift.
- Desktop and mobile crops must preserve the pedagogical object and CTA legibility.
- No in-image copy may block ES/EN/FR.
- Any visible mismatch in material, eye construction, ear count, limb count, temperature, or palette returns the asset to production.
