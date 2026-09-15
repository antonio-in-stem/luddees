# Luddies master prompts

These prompts are production contracts. Always attach the referenced master images; the text alone does not guarantee consistency. Generate one piece, inspect it at its real page size, and reject drift before producing a batch.

## Shared visual DNA

```text
Project: Luddies visual system v1, “tactile learning workshop”.
Reference hierarchy: character-family master first; accepted family master second; written prompt third.
Preserve globally: slate #565676, cherry #A76571, antique rose #C38D94, pale lilac #AEADF0, light lavender #D8DCFF, warm paper #F7F3EE, ink #27273D. Matte molded-paper characters, restrained short felt only on ears/cuffs, uncoated card, matte painted wood. Large warm softbox upper-left, faint cool-lavender rim right, short soft contact shadows, controlled contrast. Three-quarter slightly elevated editorial camera, no extreme perspective, no dramatic depth of field.
Never: green/cyan/neon/rainbow palette except a muted natural green required by a plant; fuzzy bean monsters; glossy plastic; entertainment-brand imitation; extra limbs or ears; floating objects; generic confetti; text, numbers, logo, watermark, UI, or fake certification marks inside the raster.
Localization: reserve composition for live HTML; never bake ES, EN, or FR marketing copy into the image.
```

## Character master / variation CHR-01

Attach: `client/images/luddees/identity-v2/masters/luddees-character-family-v1.png`.

```text
Use case: stylized-concept
Asset type: {{CHARACTER_ASSET_SLOT}}, family CHR-01 v{{VERSION}}
Input image: the attached Luddies character-family master is the identity anchor. Preserve exact anatomy, relative heights, eye construction, face language, base colors, ear posture, material, texture scale, and light.
Primary request: show {{CHARACTERS}} performing {{ACTION}} with {{PROPS}}. The action must communicate {{NARRATIVE_FUNCTION}}.
Character invariants: Lumo is medium and slate with two upright ears; Miga is short and antique rose with one bent ear; Nilo is tall and pale lilac with slate cuffs and one relaxed ear. Each has exactly two arms, two short legs, two long rounded ears, oval eyes with small dark pupils, a tiny mouth, no nose, and mitten-like hands.
Composition/framing: {{ASPECT_RATIO}}; {{SUBJECT_PLACEMENT}}; full ears and bodies visible; protect {{SAFE_MARGIN}} margins; {{COPY_SAFE_ZONE}}.
Backdrop: {{BACKDROP}}.
Constraints: use the shared Luddies visual DNA verbatim. Props may change; anatomy and identity may not.
```

## Home hero HERO-01

Attach: the CHR-01 master and, after approval, `client/images/luddees/identity-v2/hero/home-marketplace-v1.png`.

```text
Use case: stylized-concept
Asset type: responsive landing-page hero, family HERO-01 v{{VERSION}}
Primary request: show {{CHARACTERS}} turning {{TEACHING_ASSET}} into {{HANDS_ON_ACTIVITY}}. The image must prove “ready-to-use teaching assets become collaborative learning,” not generic play.
Scene: warm off-white seamless studio; one subtle embossed dotted arc derived from the twin-loop motif; only subject-relevant objects.
Composition/framing: {{DESKTOP_OR_MOBILE}} {{ASPECT_RATIO}}. Reserve {{COPY_ZONE_PERCENT}} as a calm low-detail zone for live HTML. Cluster the narrative sequence in {{SUBJECT_SIDE}}. Protect 8% margins and keep the decisive pedagogical object inside the mobile crop.
Constraints: match CHR-01 anatomy and the shared visual DNA. No raster text, fake screen, random science clutter, classroom stock-photo setting, or decorative object without narrative function.
Output review: verify copy zone, CTA contrast, crop, object-to-character hierarchy, ear/limb count, palette, and material match.
```

## Borderless composition family v2

Attach: `client/images/luddees/identity-v2/masters/luddees-character-family-v1.png` and the accepted transparent asset for the target family.

```text
Use case: stylized-concept
Asset type: {{HERO_OR_SECTION_OR_CTA}} transparent cutout, family {{FAMILY_ID}} v{{VERSION}}
Primary request: show {{CHARACTERS}} performing {{ONE_CONNECTED_ACTION}} with {{TEACHING_OBJECTS}}. The scene must communicate {{NARRATIVE_FUNCTION}} through a single connected silhouette.
Identity: preserve CHR-01 anatomy, relative heights, colors, eye construction, ear posture, molded-paper texture, and restrained felt details.
Composition: {{ASPECT_RATIO}}; {{ANCHOR_EDGE}} anchored; foreground, middle, and rear subjects overlap; vary scale deliberately; reserve {{COPY_SAFE_ZONE}} for live HTML; allow only the declared edge crop {{EDGE_CROP}}.
Lighting: upper-left key, cool-lavender rim, richer controlled contrast than v1, short shadows attached only to foreground objects.
Output: actual RGBA transparency. Pixels outside characters, props, and attached shadows must have zero alpha. Never draw a checkerboard, studio sweep, floor plane, panel, or vignette.
Constraints: no raster text, logo, UI, random science clutter, disconnected floating objects, extra anatomy, glossy plastic, or palette drift.
Output review: inspect alpha extrema, copy collision, meaningful crop, silhouette, identity, object hierarchy, and real desktop/mobile placement before accepting.
```

## Marketplace cover COVER-01

Attach: the CHR-01 master plus at least one accepted cover anchor. For production after this pass, attach both `science-experiments-v1.png` and `geometry-bridge-v1.png`.

```text
Use case: product-mockup
Asset type: square marketplace cover, family COVER-01 v{{VERSION}}, subject {{SUBJECT_ID}}
Primary request: create a premium cover for {{RESOURCE_NAME}}. Product hero: an open warm-paper portfolio containing three unlabeled lesson cards about {{CARD_CONTENT}}, beside {{KIT_OBJECTS}}. {{CHARACTER}} appears only as a small useful cameo, {{CHARACTER_ACTION}}.
Scene/backdrop: match the accepted cover anchors exactly: warm off-white tabletop and seamless background, one barely visible embossed dotted arc, no classroom furniture.
Composition/framing: 1:1 square; three-quarter slightly elevated view; central product cluster about 68% of frame; clean top-left corner for an HTML badge; all essential objects inside safe margins; recognizable at 240 px.
Materials: uncoated paper folder/cards, matte painted wood and subject-appropriate material, molded-paper character, restrained felt on ears/cuffs only.
Constraints: match anchor camera, light, texture scale, contact shadows, product-to-character ratio, and shared palette. No typography, letters, numbers, formulas, logos, watermarks, UI, certification seals, extra characters, glossy plastic, or rainbow kit.
Output review: compare side by side with both anchors at 240 px and 1024 px. Reject color, camera, eye, anatomy, material, or density drift.
```

## Organization mechanism ORGANIZATION-01

No character reference is required. Attach the latest accepted ORGANIZATION-01 asset when producing a derivative.

```text
Use case: stylized-concept
Asset type: transparent panoramic website process render, family ORGANIZATION-01 v{{VERSION}}
Primary request: create one connected horizontal sequence of four tactile educational mechanisms: {{SUBJECT_MECHANISM}}, {{TOPIC_MECHANISM}}, {{CLASS_MECHANISM}}, and {{REINFORCEMENT_MECHANISM}}. Each station must have a unique silhouette and connect to one shared segmented paper path.
Composition: very wide strip; four stations centered at roughly 12.5%, 37.5%, 62.5%, and 87.5%; common baseline; three-quarter slightly elevated editorial camera; generous transparent clearance; no edge crop.
Materials and light: shared Luddies visual DNA, finely grained molded paper, matte cardstock, restrained felt tabs, warm upper-left key, cool-lavender right rim, short object-bound shadows.
Output: genuine RGBA transparency. Render only objects and their attached shadows.
Never: characters, mascots, faces, eyes, limbs, text, letters, numbers, logos, UI cards, generic app icons, glassmorphism, glow, checkerboard, room, panel, or floor plane.
Output review: verify four-column alignment, unique silhouettes, continuous workflow, alpha extrema, material consistency, and legibility both as one desktop strip and four mobile slices.
```

## Team room composition TEAM-ROOM-01

The team photographs are identity evidence, not generation inputs. Keep every source photograph unchanged in HTML and compose the room around it.

```text
Use case: people-preserving editorial composition
Asset type: responsive team gallery, family TEAM-ROOM-01 v{{VERSION}}
Human invariants: use the supplied team photographs as exact, unmodified source pixels. Never synthesize, repaint, face-swap, relight, extend, restyle, or change a person's pose, expression, clothing, body, or identity. Uniformity comes only from the shared HTML frame treatment, CSS color grade, ambient wall light, and surrounding depth.
Scene: a warm, slightly imperfect family living-room gallery wall with a dark-wood picture rail, mixed real-world frame proportions, cream mats, small paper plaques, a low wooden console, a few restrained domestic objects, and generous breathing room. It should feel collected over time, not like an e-commerce card grid.
Composition: five portraits in the upper salon arrangement and three larger portraits below. Preserve each source aspect ratio where practical; use only conservative framing crops and never crop a face or identity cue. Names, roles, and biographies remain live HTML for ES/EN/FR.
Character interventions: reuse approved transparent CHR-01 derivatives as small inhabitants of the room. Place them between frames or on the console, with intentional edge crops; they may overlap furniture but never a human face, name, role, or essential biography.
Lighting: warm upper-center/upper-left room glow, subtle lavender reflected fill, grounded frame shadows, restrained paper-and-wood texture.
Never: generated group portrait, altered human identity, floating card carousel, equal repeated cards, checkerboard-backed cutout, baked-in name, role, biography, logo, or language-specific copy.
Output review: verify all eight people, exact names, unchanged faces and poses, readable plaques, no content collision, real alpha on mascot assets, coherent desktop salon, and a single-column mobile wall.
```

## Purpose journey PURPOSE-01

Attach: `client/images/luddees/identity-v2/masters/luddees-character-family-v1.png` and the latest accepted PURPOSE-01 asset.

```text
Use case: stylized-concept
Asset type: panoramic About-page mechanism, family PURPOSE-01 v{{VERSION}}
Primary request: connect an open kraft teaching portfolio and blank cream learning cards to a broad accessible lavender bridge, then to a slate cardboard telescope aimed at one pale-lavender faceted destination star. One dusty-rose cord must link the entire journey from mission to vision.
Identity: use CHR-01 only for palette, materials, camera, texture scale, and light; include no characters, faces, eyes, ears, or limbs.
Composition: very wide connected silhouette; portfolio anchored left, telescope and star right, bridge as a strong diagonal; all primary objects fully visible in their desktop panorama and respective mobile half.
Backdrop: uniform warm paper #F7F3EE, seamless with the page; no panel edge, horizon, gradient, grid, or vignette.
Never: text, numbers, logo, UI card, floating unrelated object, neon, glossy plastic, or generic iconography.
```

## Values workbench VALUES-02

Attach: `client/images/luddees/identity-v2/masters/luddees-character-family-v1.png` and the latest accepted VALUES-02 asset.

```text
Use case: stylized-concept
Asset type: three-part About-page values render, family VALUES-02 v{{VERSION}}
Primary request: create exactly three large tactile mechanisms on one baseline: an opened faceted paper bulb exposing a lavender gear for Innovation; three differently sized arches forming one usable bridge for Inclusion; and a precisely balanced faceted star on a wooden calibration stand for Excellence. Link all three with one restrained dusty-rose felt cord.
Identity: use CHR-01 only for palette, materials, camera, texture scale, and light; include no characters or anatomy.
Composition: centers at 17%, 50%, and 83%; each third must contain its complete primary object so the panorama can become three large mobile scenes without cropping the concept.
Backdrop: uniform ink #27273D; object-bound shadows only; no panel, horizon, gradient, grid, or vignette.
Never: text, numbers, logo, emoji-like icons, glassmorphism, neon, glossy plastic, or random STEM clutter.
```

## Missing-resource scene ERROR-01

Attach: `client/images/luddees/identity-v2/masters/luddees-character-family-v1.png` and, after approval, `client/images/luddees/identity-v2/errors/luddies-search-party-404-v1.png`.

```text
Use case: stylized-concept
Asset type: transparent responsive error-page hero, family ERROR-01 v{{VERSION}}
Primary request: show the three CHR-01 Luddies searching together for one missing educational resource. Lumo sorts blank cards in an open kraft archive, Miga looks beneath a curling cream paper sheet, and Nilo scans the distance with the familiar cardboard telescope. Their expressions are curious and reassuring, never sad or alarmed.
Composition: wide connected ensemble; visual weight centered and low; full ears, bodies, props, and telescope inside generous transparent margins; suitable for large right-edge desktop placement and uncropped full-width mobile placement.
Materials and lighting: preserve the shared Luddies visual DNA; molded-paper bodies, restrained felt, warm uncoated paper, kraft card; soft upper-left key and short attached contact shadows.
Output: genuine RGBA transparency. Render only characters, props, and their attached shadows.
Never: typography, numerals, symbols, logos, UI, backdrop, floor rectangle, glow field, vignette, extra anatomy, generic clay style, or palette drift.
Output review: verify identity, alpha extrema, complete silhouettes, desktop copy clearance, mobile one-screen fit, and that live HTML owns all 404 messaging.
```

## Localized derivative

Use only when the artifact itself must display language. The base render remains unchanged.

```text
Use case: text-localization
Asset type: localized derivative of {{MASTER_FILE}} for locale {{LOCALE}}
Edit target: the attached approved master.
Change only: the explicitly listed printed teaching-artifact text from “{{SOURCE_TEXT}}” to “{{TARGET_TEXT}}”.
Preserve exactly: characters, anatomy, objects, composition, crop, camera, light, color, materials, texture, background, shadows, and every non-text pixel possible.
Typography: reproduce the source card's size, weight, alignment, ink color, and line wrapping; render the target text verbatim.
Constraints: do not translate page headline, CTA, price, badge, or metadata into the raster. Those remain live HTML.
```
