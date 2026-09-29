# Telematics Stack

Production-hardened telematics firmware, sold as a full package or as drop-in components, with the compliance and go-to-market help to ship a device. The brand is a **bold challenger on a light ground**: black is the primary colour, volt is a highlighter, type is loud and square, and every claim is backed by a number.

## Voice

- **Lead with the fact.** "Zero crashes in production." "Under 30 KB of flash." The number is the headline; the sentence after it explains.
- **Short, declarative, present tense.** No "we believe", no "leveraging". Say what it does.
- **Uppercase is for display type only.** Body copy is sentence case. Eyebrows are uppercase because they are set in mono, not because they are important.
- **Name competitors when the comparison is concrete** (a Munic-class dongle without an ignition wire), never as a general jab.
- **Numbers as they are.** Spec-style values (`<30 KB`, `1 KB RAM`, `2010+`) are set in `mono-body`; they are not rounded up for effect.

## Colour

The palette is four colours plus two status hues. Black (`ink`) carries the brand; `volt` is the accent.

- `ground` #F4F4F0 is the default page. Do not use pure white as a page; `surface` #FFFFFF is for cards on ground, and always with a `border-strong` edge.
- `ink` #0A0A0A is text, icons, borders and the `block` fill. Big black slabs are welcome — a black footer, a black stat card, the black mark tile — that is where the "bold" lives now that the page is light.
- `volt` #D4FF3A is a **fill, never type and never a line.** It goes behind black text: a highlighter bar behind one word of a headline, a stat block, the primary button, the top bar of the mark. A page should have one or two volt moments, not a volt wash.
- `on-volt` is always black, in both themes.
- `alert` (crash events, errors) and `ok` (healthy, trip active) are the only other hues. They are for status, never decoration, and they differ in lightness so they survive colour-blindness.

There is one theme, light. Dark surfaces come from `block` panels placed on the light ground, never from inverting the page.

## Type

Three faces, each with one job.

- **Archivo Black** (`display`) for headlines: uppercase, tight (`-0.045em` at 84px, loosening as it gets smaller), leading under 1. Break lines by phrase — "SHIP IN / MONTHS, NOT / YEARS." — never mid-word except the brand's own "TELE-MATICS" hero split.
- **Archivo** (`sans`) for everything you read: body at 16/1.5, headings at 22/700 in sentence case, buttons at 15/700 uppercase.
- **Space Mono** (`mono`) for specs, code, captions and eyebrows. Mono is what makes the brand an engineering company rather than a marketing one; use it wherever a value is a measurement.

Rules: no italics; no weights below 400; no font other than these three, including in slides; no gradient or outline text.

## Shape and surface

- **Square.** `radius-none` is the only radius. Buttons, cards, inputs, images and the mark are hard-cornered.
- **Borders, not shadows.** A card on ground is `surface` with a `border-strong` (2px `line-strong`) edge. Nothing in the system casts a shadow.
- **Blocks touch.** Stat blocks and tiles sit at `space-2` (8px) gaps or flush. Whitespace is generous *around* a group, tight *inside* it.
- **Grid.** 12 columns, 24px gutter, 64px margin at 1280–1440. Slides use the same margins at 1920×1080.

## Logo

See the Logos asset group. The mark is a black tile with three left-aligned bars, longest on top, the top bar in volt: a stack read from the bottom up, or a signal strength read the other way. The wordmark is Archivo Black, uppercase, tracked `-0.02em`, and is supplied outlined so it needs no font.

- Horizontal lockup for headers, footers, documents. Minimum height 32px.
- Stacked wordmark ("TELEMATICS / STACK" with the volt bar behind STACK) for covers and hero placements only. Minimum width 240px.
- Mark alone for favicons, app icons and social avatars. Minimum 24px.
- Clear space: one bar-height of the mark on all sides.
- Never recolour the bars, rotate, outline, add a drop shadow, or set the wordmark in a different face. On photography, use the mono (single-ink) lockup on a solid `ground` or `block` panel rather than placing it directly on the image.

## Iconography

Inline stroke icons, 2px stroke in `ink` (or `on-block`, `on-volt`), 24px grid, square caps and joins to match the type. No filled icon sets, no duotone, no emoji. Prefer a mono number to an icon whenever a number exists.

## Imagery

Product photography on a `ground` or `block` seamless, hard-lit, top-down or three-quarter, no lifestyle scenes. Screenshots of logs, CAN traces and crash dumps are on-brand imagery: crop them tight, set them in `mono-body`, and give them a `border-strong` frame.

## Components

`Button` (primary black, volt, outline), `StatBlock` (volt, block, outline), `FeatureCard` and `Eyebrow` ship in the bundle under `window.TelematicsStack`. Compose pages from these before inventing new patterns; a page that needs a fourth button variant probably needs fewer buttons.
